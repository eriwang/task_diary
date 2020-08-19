import {getDateStr, getTodayPlusDelta} from '../utils/date_utils.js';
import BackendAjaxHandler from './backend_ajax_handler.js';

class NotesBackendHandlerClass
{
    constructor()
    {
        const yesterdayDateStr = getDateStr(getTodayPlusDelta(-1));
        const todayDateStr = getDateStr(new Date());

        this.notesId = 0;
        this.data = [
            {
                'id': ++this.notesId,
                'text': 'Productive day today. I think my code for routing is probably flawless, no bugs.',
                'date': yesterdayDateStr
            },
            {
                'id': ++this.notesId,
                'text': 'So far not super productive, I should stop procrastinating and watching YouTube videos. My ' + 
                        'productive self from yesterday really needs to take over for today.\n\n' +
                        'On another note, hopefully the bugs from yesterday and forgetting about rice are the last ' + 
                        'surprises I\'ll have today.',
                'date': todayDateStr
            }
        ];
    }

    dailyNotesRoutehandler = (method, data) =>
    {
        switch (method)
        {
        case 'GET':
            return this._handleDailyNotesGet(data);

        case 'PUT':
            return this._handleDailyNotesPut(data);
        
        default:
            throw `Invalid /daily_notes method ${method}`;
        }
    }

    _handleDailyNotesGet = (data) =>
    {
        for (const notes of this.data)
        {
            if (notes.date === data['date'])
            {
                return {'notes': notes};
            }
        }
        return {'notes': null};
    }

    _handleDailyNotesPut = (data) =>
    {
        for (let notes of this.data)
        {
            if (notes.date === data['date'])
            {
                notes.text = data['text'];
                return {'success': true};
            }
        }

        data['id'] = ++this.notesId;
        this.data.push(data);
        return {'success': true};
    }
}

let notesBackendHandler = new NotesBackendHandlerClass();
BackendAjaxHandler.addAjaxRouteHandler('/daily_notes', notesBackendHandler.dailyNotesRoutehandler);