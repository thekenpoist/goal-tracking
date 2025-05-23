document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (e) => {
        const navBtn = e.target.closest('.calendar-nav');
        if (!navBtn) return;

        e.preventDefault();

        const month = navBtn.getAttribute('data-month');
        const calendarContainer = document.getElementById('goal-calendar');
        const goalUuid = calendarContainer.dataset.goalUuid;

        console.log('Month clicked:', month, '| Goal UUID:', goalUuid);
        console.log('Clicked:', month, '| Goal:', goalUuid);

        try {
            const response = await fetch(`/goal/${goalUuid}/calendar?month=${month}`);
            const html = await response.text();
            calendarContainer.innerHTML = html;
        } catch (err) {
            console.error('Error loading calendar:', err);
            calendarContainer.innerHTML = `<p class="text-red-500">Failed to load calendar. Try again.</p>`;
        }
    });
    document.body.addEventListener('click', async (e) => {
        const cell = e.target.closest('[data-goal-uuid][data-date][data-status]');

        if (!cell) return;
            
        const status = cell.dataset.status;

        if (['locked', 'disabled', 'future'].includes(status)) return;

        const goalUuid = cell.dataset.goalUuid;
        const date = cell.dataset.date;

        try {
            const res = await fetch(`/goals/${goalUuid}/log/${date}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const result = await res.json();

            if (res.ok && result.toggled !== undefined) {

                cell.classList.remove('bg-green-500', 'bg-red-500', 'text-white', 'text-gray-700');
        
                if (result.toggled) {
                  
                  cell.classList.add('bg-green-500', 'text-white');
                  cell.dataset.status = 'done';
                } else {
                  
                  cell.classList.add('bg-red-500', 'text-white');
                  cell.dataset.status = 'missed';
                }
              } else {
                console.error('Unexpected response:', result);
              }
            } catch (err) {
              console.error('Failed to toggle goal log:', err);
        }
        
    });
});