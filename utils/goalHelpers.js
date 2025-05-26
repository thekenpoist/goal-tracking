function getCurrentCalendarWeek() {
    const today = new Date();
    const startOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);

    return { startOfWeek, endOfWeek };
}
/*
function getGoalLogsThisWeek(goalLogs) {
    const { startOfWeek, endOfWeek } = getCurrentCalendarWeek();

    const filteredLogs = goalLogs.filter(log => {
        const sessionDate = new Date(log.sessionDate);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });

    return filteredLogs.sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
}
*/

function getGoalLogsThisWeek(goalLogs) {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localMidnight = new Date(now.getTime() - timezoneOffset);
    localMidnight.setHours(0,0,0,0);

    const startOfWeek = new Date(localMidnight);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    console.log('🗓️ startOfWeek (Local):', startOfWeek.toISOString(), 'endOfWeek (Local):', endOfWeek.toISOString());

    const filteredLogs = goalLogs.filter(log => {
        const sessionDate = new Date(log.sessionDate);
        console.log('🔍 Comparing', sessionDate.toISOString(), 'to window:', startOfWeek.toISOString(), '-', endOfWeek.toISOString());
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    }).sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

    console.log('✅ Filtered logs:', filteredLogs.map(log => log.sessionDate));

    return filteredLogs;
}



module.exports = {
    getCurrentCalendarWeek,
    getGoalLogsThisWeek
};
