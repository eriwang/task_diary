import {ajaxGet, ajaxPut} from '../common/ajax.js';

class NotesManagerClass
{
    constructor()
    {
        this.dateStr = null;
        this.notes = '';
        this.listenerCallbacks = [];
    }

    refreshNotes = () =>
    {
        ajaxGet('/daily_notes', {'date': this.dateStr})
            .done((data) => this._onChange(data['notes']));
    }

    setNotes = (text) =>
    {
        return ajaxPut('/daily_notes', {'date': this.dateStr, 'text': text})
            .done(this.refreshNotes);
    }

    changeDateAndRefresh = (dateStr) =>
    {
        this.dateStr = dateStr;
        this.refreshNotes();
    }

    addListenerCallback = (cb) =>
    {
        this.listenerCallbacks.push(cb);
    }

    _onChange = (notes) =>
    {
        this.notes = (notes === null) ? '' : notes.text;
        for (const cb of this.listenerCallbacks)
        {
            cb(this.notes);
        }
    }
}

let NotesManager = new NotesManagerClass();
export default NotesManager;
