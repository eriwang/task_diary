// TODO: move to mock_ajax.js?
class BackendAjaxHandlerClass
{
    constructor()
    {
        this.urlToHandler = {};
    }

    callAjax(url, data, method)
    {
        let handler = this.urlToHandler[url];
        if (handler === undefined)
        {
            throw `Handler for url=${url} does not exist`;
        }

        return handler(method, data);
    }

    addAjaxRouteHandler(url, handler)
    {
        this.urlToHandler[url] = handler;
    }
}

let BackendAjaxHandler = new BackendAjaxHandlerClass();
export default BackendAjaxHandler;