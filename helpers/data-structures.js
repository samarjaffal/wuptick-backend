const sortArrayByDate = (array, field, des = true) => {
    const sortedArray = array.sort(function (a, b) {
        var dateA = new Date(a[field]),
            dateB = new Date(b[field]);
        if (des) return dateB - dateA;
    });

    return sortedArray;
};

module.exports = { sortArrayByDate };
