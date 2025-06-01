function buildCalendarGrid(targetDate = new Date(), timezone = 'UTC') {
    const { utcToZonedTime , startOfWeek, endOfWeek } = require('date-fns-tz');
    const { startOfMonth, endOfMOnth, eachDayOfInterval } = require('date-fns');

    const localTargetDate = utcToZonedTime(targetDate, timezone);

    const monthStart = startOfMonth(localTargetDate);
    const monthEnd = endOfMOnth(localTargetDate);

    const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const calendar = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const currentMonth = localTargetDate.getMonth();
    const currentYear = localTargetDate.getFullYear();
    const currentMonthName = localTargetDate.toLocaleString('default', { month: 'long', timeZone: timezone });
    

    return {
        calendar,
        currentMonth,
        currentYear,
        currentMonthName
    };
}

module.exports = { buildCalendarGrid };
