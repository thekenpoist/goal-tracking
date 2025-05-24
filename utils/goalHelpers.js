function getCurrentCalendarWeek() {
    const today = new Date();
    const startOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);

    return { startOfWeek, endOfWeek };
}

function getGoalsThisWeek(goalLogs) {
    const { startOfWeek, endOfWeek } = getCurrentCalendarWeek();

    return goalLogs.filter(log => {
        const sessionDate = new Date(log.sessionDate);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    }).sort((a,b) => new Date(a.sessionDate) - new Date(b.sessionDate));
}



module.exports = {
    getCurrentCalendarWeek,
    getGoalsThisWeek
};
