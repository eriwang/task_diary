import BackendAjaxHandler from '../mock_site/backend_ajax_handler.js';

// Do not use anywhere other than ajax.js!

function ajaxQueryParameter(url, data, method)
{
    return _createBackendAjaxHandlerPromise(url, data, method);
}

function ajaxJson(url, data, method)
{
    return _createBackendAjaxHandlerPromise(url, data, method);
}

function _createBackendAjaxHandlerPromise(url, data, method)
{
    return new Promise((resolve, reject) => {
        try
        {
            resolve(BackendAjaxHandler.callAjax(url, data, method));
        }
        catch (e)
        {
            reject(e);
        }
    });
}

export {ajaxQueryParameter, ajaxJson};