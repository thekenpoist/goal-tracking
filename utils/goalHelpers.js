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

    return achieved >= windowStart && achieved <= windowEnd;
}

module.exports = {
    isWithinCurrentRollingWindow
};