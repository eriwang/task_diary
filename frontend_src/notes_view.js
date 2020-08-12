import React from 'react';

import {TextInput} from './common/form_components.js';
import NotesManager from './state_managers/notes_manager.js';

export default class NotesView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'notes': (this.props.notes === null) ? '' : this.props.notes
        };
    }

    componentDidMount()
    {
        // No refresh is necessary here because the App component handles it. That said, might be cleaner to have the 
        // "addListener" call (or maybe rename to subscribe) immediately fire with the current value, and have the
        // refresh managed externally the first time.
        NotesManager.addListenerCallback(this._handleNotesChange);
    }

    _handleTextInputChange = (event) =>
    {
        this._handleNotesChange(event.target.value);
    }

    _handleNotesChange = (notes) =>
    {
        this.setState({'notes': notes});
    }

    _handleSubmit = () =>
    {
        NotesManager.setNotes(this.state.notes);
    }

    render()
    {
        return (
            <div id="notes-view">
                <h3>Daily Notes</h3>
                <TextInput label="Notes" value={this.state.notes}
                    onChange={this._handleTextInputChange} isMultiLine />
                <button onClick={this._handleSubmit}>Submit</button>
            </div>
        );
    }
}