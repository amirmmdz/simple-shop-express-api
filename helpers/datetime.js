function getNextDateTimeByHour(hour){
    const now = new Date();
    const next = new Date(now.getTime() + (parseInt(hour) * 60) * 60 * 1000);
    return next;
}



module.exports = {
    getNextDateTimeByHour
};