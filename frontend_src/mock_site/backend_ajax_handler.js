// TODO: move to mock_ajax.js?
class BackendAjaxHandlerClass
{
    constructor()
    {
        this.urlToHandler = {};
    }

    callAjax(url, data, method)
    {
        console.log(`[${method}] ${url} with ${data}`);
        let handler = this.urlToHandler[url];
        if (handler === undefined)
        {
            throw `Handler for url=${url} does not exist`;
        }

        return handler(method, data);
    }

    addAjaxRouteHandler(url, handler)
    {
        console.log(`Add ${url}`);
        this.urlToHandler[url] = handler;
        console.log(this.urlToHandler);
    }
}

let BackendAjaxHandler = new BackendAjaxHandlerClass();
export default BackendAjaxHandler;