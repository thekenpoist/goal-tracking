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
    const now = new Date();
    const localNow = utcToZonedTime(now, timezone);

    const weekStart = startOfWeek(localNow, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(localNow, { weekStartsOn: 0 });

    const startUTC = zonedTimeToUtc(weekStart, timezone);
    const endUTC = zonedTimeToUtc(weekEnd, timezone);

    console.log('startOfWeek (Local):', weekStart.toLocaleString(), 'endOfWeek (Local):', weekEnd.toLocaleString());
    console.log('startOfWeek (UTC):', startUTC.toISOString(), 'endOfWeek (UTC):', endUTC.toISOString());

    const filteredLogs = goalLogs.filter(log => {
        const logDateStr = log.sessionDate;
        const logDate = new Date(logDateStr + 'T00:000:000');

        const logDay = logDate.toISOString().split('T')[0];
        const startDay = startUTC.toISOString().split('T')[0];
        const endDay = endUTC.toISOString().split('T')[0];

        console.log('Comparing', logDay, 'to window:', startDay, '-', endDay);
        
        return logDay >= startDay && logDay <= endDay;
    }).sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

    console.log('Filtered logs:', filteredLogs.map(log => log.sessionDate));

    return filteredLogs;
}




module.exports = {
    getCurrentCalendarWeek,
    getGoalLogsThisWeek
};
