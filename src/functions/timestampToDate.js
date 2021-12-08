module.exports = timestampToDate = function(timestamp) {
    var date = new Date(timestamp);

    var fulldate = date.toLocaleDateString("fr-FR")

    return fulldate;
}