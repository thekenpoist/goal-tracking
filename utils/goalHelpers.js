const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');
const { startOfWeek, endOfWeek } = require('date-fns');

function getCurrentCalendarWeek(timezone = 'UTC') {
    const now = new Date();
    const localNow = utcToZonedTime(now, timezone);

    const weekStart = startOfWeek(localNow, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(localNow, { weekStartsOn: 0 });

    const startUTC = zonedTimeToUtc(weekStart, timezone);
    const endUTC = zonedTimeToUtc(weekEnd, timezone);

    return { startOfWeek: startUTC, endOfWeek: endUTC };
}

function getGoalLogsThisWeek(goalLogs, timezone) {
    const now = utcToZonedTime(new Date(), timezone); // Always user's local time

    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

    const startDay = `${weekStart.getFullYear()}-${(weekStart.getMonth() + 1).toString().padStart(2, '0')}-${weekStart.getDate().toString().padStart(2, '0')}`;
    const endDay = `${weekEnd.getFullYear()}-${(weekEnd.getMonth() + 1).toString().padStart(2, '0')}-${weekEnd.getDate().toString().padStart(2, '0')}`;

    const filteredLogs = goalLogs.filter(log => {
        const logDateStr = log.sessionDate;

        if (!logDateStr) {
            console.warn('Skipping log with missing sessionDate:', log);
            return false;
        }

        return logDateStr >= startDay && logDateStr <= endDay;
    });

    return filteredLogs;
}





module.exports = {
    getCurrentCalendarWeek,
    getGoalLogsThisWeek
};
