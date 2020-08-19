function getDateStr(date)
{
    const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = (date.getDate()).toString().padStart(2, '0');
    return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

export {getDateStr};