import {ajaxGet, ajaxPut} from '../ajax.js';

class NotesManagerClass
{
    constructor()
    {
        this.dateStr = null;
        this.notes = null;
        this.listenerCallbacks = [];

        this.refreshNotes = this.refreshNotes.bind(this);
        this.setNotes = this.setNotes.bind(this);
        this.changeDateAndRefresh = this.changeDateAndRefresh.bind(this);
        this.addListenerCallback = this.addListenerCallback.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    refreshNotes()
    {
        ajaxGet('/daily_notes', {'date': this.dateStr})
            .done((data) => this.onChange(data['notes']));
    }

    setNotes(text)
    {
        return ajaxPut('/daily_notes', {'date': this.dateStr, 'text': text})
            .done(this.refreshNotes);
    }

    changeDateAndRefresh(dateStr)
    {
        this.dateStr = dateStr;
        this.refreshNotes();
    }

    addListenerCallback(cb)
    {
        this.listenerCallbacks.push(cb);
    }

    onChange(notes)
    {
        this.notes = notes;
        for (const cb of this.listenerCallbacks)
        {
            cb(this.notes.text);
        }
    }
}

let NotesManager = new NotesManagerClass();
export default NotesManager;
