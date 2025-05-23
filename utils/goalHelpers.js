function isWithinCurrentRollingWindow(startDate, wasAchievedAt) {
    if (!startDate || !wasAchievedAt) return false;

    const now = new Date();
    const start = new Date(startDate);
    const achieved = new Date(wasAchievedAt);

    const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const currentWindowIndex = Math.floor(daysSinceStart / 7);

    const windowStart = new Date(start);
    windowStart.setDate(windowStart.getDate() + currentWindowIndex * 7);

    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 6);

    console.log("WINDOW:", {
        startDate,
        wasAchievedAt,
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString()
      });

      return achieved >= windowStart && achieved <= windowEnd;

}

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

module.exports = {
    isWithinCurrentRollingWindow,
    countLogsInCurrentRollingWindow
};