function buildCalendarGrid(targetDate = new Date()) {
    const currentMonth = targetDate.getMonth();
    const currentYear = targetDate.getFullYear();
    const currentMonthName = targetDate.toLocaleString('default', { month: 'long' });
    
    const firstOfMonth = new Date(currentYear, currentMonth, 1);
    const lastOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const startDate = new Date(firstOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(lastOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const calendar = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        calendar.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        calendar,
        currentMonth,
        currentYear,
        currentMonthName
    };
}

module.exports = { buildCalendarGrid };