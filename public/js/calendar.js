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
});