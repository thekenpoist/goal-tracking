document.addEventListener('DOMContentLoaded', () => {
  attachGoalClickHandlers();
});

// Attach click listeners to the goal list on the left
function attachGoalClickHandlers() {
  const goalElements = document.querySelectorAll('[onclick^="loadGoalDetails"]');
  goalElements.forEach(el => {
    el.addEventListener('click', () => {
      const match = el.getAttribute('onclick').match(/loadGoalDetails\('(.+?)'\)/);
      if (match) {
        const goalUuid = match[1];
        loadGoalDetails(goalUuid);
      }
    });
  });
}

// Load goal details and calendar when a goal is clicked
function loadGoalDetails(goalUuid) {
  fetch(`/goals/partials/${goalUuid}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById('goalDetails').innerHTML = html;

      fetch(`/goal-logs/partials/calendar/${goalUuid}`)
        .then(res => res.text())
        .then(calendarHtml => {
          const calendarEl = document.getElementById('goalCalendar');
          calendarEl.innerHTML = calendarHtml;

          const month = calendarEl.querySelector('.calendar-nav')?.dataset.month;
          if (month) calendarEl.dataset.month = month;

          attachCalendarNavListeners(goalUuid);
          attachCalendarCellListeners();
        })
        .catch(err => {
          document.getElementById('goalCalendar').innerHTML =
            '<p class="text-red-500">Error loading calendar.</p>';
        });

    })
    .catch(err => {
      document.getElementById('goalDetails').innerHTML =
        '<p class="text-red-500">Error loading goal details.</p>';
    });
}

// Reattach listeners to "Prev/Next" month links
function attachCalendarNavListeners(goalUuid) {
  const buttons = document.querySelectorAll('.calendar-nav');
  buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const newMonth = button.dataset.month || document.getElementById('goalCalendar').dataset.month;

      console.log('Clicking nav button, month:', newMonth);

      try {
        const res = await fetch(`/goal-logs/partials/calendar/${goalUuid}?month=${newMonth}`);
        const html = await res.text();
        const calendarEl = document.getElementById('goalCalendar');
        calendarEl.innerHTML = html;

        calendarEl.dataset.month = newMonth;

        attachCalendarNavListeners(goalUuid);
        attachCalendarCellListeners();
      } catch (err) {
        console.error('Error loading calendar month:', err);
      }
    });
  });
}

// Attach click listeners to each calendar day cell
function attachCalendarCellListeners() {
  console.log('Attaching calendar cell listeners...');
  document.querySelectorAll('.calendar-cell').forEach(cell => {
    cell.addEventListener('click', async () => {
      const status = cell.dataset.status;
      if (['locked', 'disabled', 'future'].includes(status)) return;

      const goalUuid = cell.dataset.goalUuid;
      const date = cell.dataset.date;

      console.log('Clicked day cell:', { goalUuid, date, status });

      try {
        const res = await fetch(`/goal-logs/goals/${goalUuid}/log/${date}/toggle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const result = await res.json();
        console.log('Response from toggle:', result);

        if (res.ok && result.toggled !== undefined) {
          cell.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-gray-700');

          if (result.toggled) {
            cell.classList.add('bg-green-500', 'text-white');
            cell.dataset.status = 'done';
          } else {
            cell.classList.add('bg-red-500', 'text-white');
            cell.dataset.status = 'missed';
          }
          loadGoalDetails(goalUuid);
        } else {
          console.error('Unexpected response:', result);
        }

      } catch (err) {
        console.error('Failed to toggle goal log:', err);
      }
    });
  });
}
