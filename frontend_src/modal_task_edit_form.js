import React from 'react';

export default class ModalTaskEditForm extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className="modal">
                <div className="modal-content">
                    <p>This is a modal.</p>
                    <button onClick={this.props.onClose}>Close</button>
                </div>
            </div>
        );
    }
}
