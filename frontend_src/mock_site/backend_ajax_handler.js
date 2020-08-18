class BackendAjaxHandlerClass
{
    constructor()
    {

    }

    callAjax(url, data, method)
    {
        console.log(`[${method}] ${url} with ${data}`);
        return null;
    }
}

let BackendAjaxHandler = new BackendAjaxHandlerClass();
export default BackendAjaxHandler;