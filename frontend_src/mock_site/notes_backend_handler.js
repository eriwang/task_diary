import BackendAjaxHandler from './backend_ajax_handler.js';

class NotesBackendHandlerClass
{
    constructor()
    {
    }

    dailyNotesRoutehandler = (method, data) =>
    {
        switch (method)
        {
        case 'GET':
            break;

        case 'PUT':
            break;
        
        default:
            throw `Invalid /daily_notes method ${method}`;
        }

        console.log(data);
        return null;
    }
}

let notesBackendHandler = new NotesBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/daily_notes', notesBackendHandler.dailyNotesRoutehandler);