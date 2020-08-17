import React from 'react';

import {TextInput} from './common/form_components.js';
import NotesManager from './state_managers/notes_manager.js';

export default class NotesView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.noteSubmitTimerId = null;
        this.state = {
            'notes': (this.props.notes === null) ? '' : this.props.notes
        };
    }

    componentDidMount()
    {
        // No refresh is necessary here because the App component handles it. That said, might be cleaner to have the 
        // "addListener" call (or maybe rename to subscribe) immediately fire with the current value, and have the
        // refresh managed externally the first time.
        // We don't call _handleNotesChange here because we don't want to hit the server with a note change request.
        NotesManager.addListenerCallback((notes) => this.setState({'notes': notes}));
    }

    _handleTextInputChange = (event) =>
    {
        this._handleNotesChange(event.target.value);
    }

    _handleNotesChange = (notes) =>
    {
        this.setState({'notes': notes});

        const NO_INPUT_DURATION_BEFORE_SENDING_REQUEST_MS = 500;
        if (this.noteSubmitTimerId !== null)
        {
            clearTimeout(this.noteSubmitTimerId);
        }
        this.noteSubmitTimerId = setTimeout(() => {
            // We don't want to refresh notes right after the submit is successful here, the user could still be typing
            NotesManager.setNotes(this.state.notes, true);
        }, NO_INPUT_DURATION_BEFORE_SENDING_REQUEST_MS);
    }

    render()
    {
        return (
            <div id="notes-view">
                <h3>Daily Notes</h3>
                <TextInput label="Notes" value={this.state.notes}
                    onChange={this._handleTextInputChange} isMultiLine />
            </div>
        );
    }
}