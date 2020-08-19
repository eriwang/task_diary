import {ajaxGet, ajaxPut} from '../ajax/ajax.js';

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
            .then((data) => this._onChange(data['notes']));
    }

    setNotes = (text, noRefreshAfterSet) =>
    {
        let putResult = ajaxPut('/daily_notes', {'date': this.dateStr, 'text': text});
        if (!noRefreshAfterSet)
        {
            putResult.then(this.refreshNotes);
        }
        return putResult;
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
