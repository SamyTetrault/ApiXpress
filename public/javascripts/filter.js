module.exports = function sortByField(data, field, order) {
    return data.sort((a, b) => {
        if (a[field] < b[field]) {
            return order === 'asc' ? -1 : 1;
        } else if (a[field] > b[field]) {
            return order === 'asc' ? 1 : -1;
        } else {
            return 0;
        }
    });
}