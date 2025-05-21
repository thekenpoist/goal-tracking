document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('calendar-nav')) {
            e.preventDefault();

            const month = e.target.getAttribute('data-month');
            const calendarContainer = document.getElementById('goal-calendar');
            const goalUuid = calendarContainer.dataset.goalUuid;

            try {
                const response = await fetch(`/goal/${goalUuid}/calendar?month=${month}`);
                const html = await response.text();
                calendarContainer.innerHTML = html;
            } catch (err) {
                console.error('Error loading calendar:', err);
                calendarContainer.innerHTML = `<p class="text-red-500">Failed to load calendar. Try again.</p>`;
            }
        }
    });
});