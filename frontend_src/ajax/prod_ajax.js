import $ from 'jquery';

$(document).ajaxError((event, jqXHR, settings, exception) => {
    const errorText = `"${settings.type}" request to URL "${settings.url}" failed ` +
                        `with status ${jqXHR.status}, "${exception}"`;
    console.error(errorText);
    if (jqXHR.hasOwnProperty('responseJSON'))
    {
        console.error(jqXHR.responseJSON['error']);
    }
});

function ajaxQueryParameter(url, data, method)
{
    return $.ajax(url, {
        'data': data,
        'method': method,
        'processData': true
    });
}

function ajaxJson(url, data, method)
{
    return $.ajax(url, {
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'method': method,
        'processData': false
    });
}


export {ajaxQueryParameter, ajaxJson};