function getDateStr(date)
{
    const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = (date.getDate()).toString().padStart(2, '0');
    return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

function getTodayPlusDelta(deltaDays)
{
    let newDate = new Date();
    newDate.setDate(new Date().getDate() + deltaDays);
    return newDate;
}

export {getDateStr, getTodayPlusDelta};