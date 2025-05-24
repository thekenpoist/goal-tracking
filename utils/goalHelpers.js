function countLogsInCurrentRollingWindow(startDate, logs) {
    if (!startDate || !logs || logs.length === 0) return 0;

    const now = new Date();
    const start = new Date(startDate);

    const daysSinceStart = Math.floor((Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
    ) - Date.UTC(
        start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()
    )) / (1000 * 60 * 60 * 24));

    const currentWindowIndex = Math.floor(daysSinceStart / 7);

    const windowStart = new Date(Date.UTC(
        start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + (currentWindowIndex * 7)
    ));

    const windowEnd = new Date(windowStart);
    windowEnd.setUTCDate(windowEnd.getUTCDate() + 6);

    const count = logs.filter(log => {
        const sessionDate = new Date(log.sessionDate);
        return sessionDate >= windowStart && sessionDate <= windowEnd;
    }).length;

    return count;

}

function getCurrentCalendarWeek() {
    const today = new Date();
    const startOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);

    return { startOfWeek, endOfWeek };
}

function countGoalsThisWeek(goalLogs) {
    const { startOfWeek, endOfWeek } = getCurrentCalendarWeek();

    return goalLogs.filter(log => {
        const sessionDate = new Date(log.sessionDate);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    }).length;
}



module.exports = {
    countLogsInCurrentRollingWindow,
    getCurrentCalendarWeek,
    countGoalsThisWeek
};
