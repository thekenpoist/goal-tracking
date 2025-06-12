const { utcToZonedTime } = require('date-fns-tz');
const { startOfWeek, endOfWeek, subWeeks } = require('date-fns');

// Remember, offset = 1 is one week, not one day
function getWeekRange(offset = 0, timezone = 'UTC') {
    const now = new Date();
    const localNow = utcToZonedTime(now, timezone);
    const shifted = subWeeks(localNow, offset)

    const weekStart = startOfWeek(shifted, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(shifted, { weekStartsOn: 0 });

    return { weekStart, weekEnd };
}



module.exports = {
    getWeekRange
};
