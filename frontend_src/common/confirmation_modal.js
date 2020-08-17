import React from 'react';

import {CheckButton} from '../common/svg_buttons.js';
import Modal from './modal.js';

export default class ConfirmationModal extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        window.addEventListener('keydown', this._handleKeyDown);
    }

    componentWillUnmount()
    {
        window.removeEventListener('keydown', this._handleKeyDown);
    }

    _handleKeyDown = (e) =>
    {
        if (e.key === 'Enter')
        {
            this.props.onConfirm();
        }
    }

    render()
    {
        return (
            <Modal title={this.props.title} onClose={this.props.onClose}>
                <p>{this.props.message}</p>
                <div className="confirmation-modal-confirm-row">
                    <p>Confirm</p>
                    <CheckButton onClick={this.props.onConfirm}/>
                </div>
            </Modal>
        );
    }
}