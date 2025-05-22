function buildCalendarGrid(targetDate = new Date()) {
    // Always use UTC to avoid local timezone offset issues
    const currentYear = targetDate.getUTCFullYear();
    const currentMonth = targetDate.getUTCMonth();
    const currentMonthName = targetDate.toLocaleString('default', { month: 'long', timeZone: 'UTC' });

    const firstOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
    const lastOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0));

    // Normalize grid start to Sunday of first week
    const startDate = new Date(firstOfMonth);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());

    // Normalize grid end to Saturday of last week
    const endDate = new Date(lastOfMonth);
    endDate.setUTCDate(endDate.getUTCDate() + (6 - endDate.getUTCDay()));

    const calendar = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        calendar.push(new Date(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    console.log('Grid Month:', currentMonthName, currentYear);
    console.log('Grid Start:', startDate.toISOString(), '→ End:', endDate.toISOString());
    return {
        calendar,
        currentMonth,
        currentYear,
        currentMonthName
    };
}

module.exports = { buildCalendarGrid };
