import $ from 'jquery';  // TODO: remove real ajax

// Do not use anywhere other than ajax.js!

function ajaxQueryParameter(url, data, method)
{
    console.log('ajaxQueryParameter');
    return $.ajax(url, {
        'data': data,
        'method': method,
        'processData': true
    });
}

function ajaxJson(url, data, method)
{
    console.log('ajaxJson');
    return $.ajax(url, {
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'method': method,
        'processData': false
    });
}


export {ajaxQueryParameter, ajaxJson};