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
        const sessionDate = new Date(log.sessionDate);
        console.log('Comparing', sessionDate.toISOString(), 'to window:', startUTC.toISOString(), '-', endUTC.toISOString());
        return sessionDate >= startUTC && sessionDate <= endUTC;
    }).sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

    console.log('Filtered logs:', filteredLogs.map(log => log.sessionDate));

    return filteredLogs;
}




module.exports = {
    getCurrentCalendarWeek,
    getGoalLogsThisWeek
};
