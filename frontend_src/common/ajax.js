import $ from 'jquery';

import OngoingChangeRequestTracker from '../state_trackers/ongoing_change_request_tracker.js';

$(document).ajaxError((event, jqXHR, settings, exception) => {
    const errorText = `"${settings.type}" request to URL "${settings.url}" failed ` +
                        `with status ${jqXHR.status}, "${exception}"`;
    console.error(errorText);
    if (jqXHR.hasOwnProperty('responseJSON'))
    {
        console.error(jqXHR.responseJSON['error']);
    }
});

export function ajaxGet(url, data)
{
    return $.ajax(url, {
        'data': data,
        'method': 'GET',
        'processData': true
    });
}

export function ajaxPost(url, data)
{
    return _changeAjaxJsonBody(url, data, 'POST');
}

export function ajaxPut(url, data)
{
    return _changeAjaxJsonBody(url, data, 'PUT');
}

export function ajaxDelete(url, data)
{
    return _changeAjaxJsonBody(url, data, 'DELETE');
}

function _changeAjaxJsonBody(url, data, method)
{
    const requestId = OngoingChangeRequestTracker.addRequest();
    return $.ajax(url, {
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'method': method,
        'processData': false
    })
        .done((data) => {
            // I don't believe any code actually needs data after a change at time of writing, but including this for
            // if/ when that changes.
            OngoingChangeRequestTracker.completeRequest(requestId);
            return data;
        });
}
