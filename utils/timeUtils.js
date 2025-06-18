const { utcToZonedTime } = require('date-fns-tz');
const { startOfWeek, endOfWeek, subWeeks } = require('date-fns');
const { silly } = require('winston');

// Remember, offset = 1 is one week, not one day
function getWeekRange(offset = 0, timezone = 'UTC') {
    const now = new Date();
    const localNow = utcToZonedTime(now, timezone);
    const shifted = subWeeks(localNow, offset)

    const weekStart = startOfWeek(shifted, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(shifted, { weekStartsOn: 0 });

    return { weekStart, weekEnd };
}


function normalizeDate(dateInput) {
    if (!dateInput) return null;
    if (typeof dateInput === 'string') return dateInput.slice(0, 10);
    if (dateInput instanceof Date) return dateInput.toISOString().slice(0, 10);
    return null
}


module.exports = {
    getWeekRange,
    normalizeDate
};
