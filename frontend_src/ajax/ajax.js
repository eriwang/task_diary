import {ajaxQueryParameter, ajaxJson} from './prod_ajax.js';

import OngoingChangeRequestTracker from '../state_trackers/ongoing_change_request_tracker.js';

function ajaxGet(url, data)
{
    return ajaxQueryParameter(url, data, 'GET');
}

function ajaxPost(url, data)
{
    return ajaxJson(url, data, 'POST')
        .done(_createRequestCompleteCallback());
}

function ajaxPut(url, data)
{
    return ajaxJson(url, data, 'PUT')
        .done(_createRequestCompleteCallback());
}

function ajaxDelete(url, data)
{
    return ajaxJson(url, data, 'DELETE')
        .done(_createRequestCompleteCallback());
}

function _createRequestCompleteCallback()
{
    const requestId = OngoingChangeRequestTracker.addRequest();
    return (data) => {
        OngoingChangeRequestTracker.completeRequest(requestId);
        return data;
    };
}

export {ajaxGet, ajaxPost, ajaxPut, ajaxDelete};