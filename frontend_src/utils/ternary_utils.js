function getDefaultIfUndefined(value, defaultValue)
{
    return (value === undefined) ? defaultValue : value;
}

export {getDefaultIfUndefined};