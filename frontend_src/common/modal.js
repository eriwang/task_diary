import React from 'react';

import {CrossButton} from '../common/svg_buttons.js';

export default class Modal extends React.Component
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
        if (e.key === 'Escape')
        {
            this.props.onClose();
        }
    }

    render()
    {
        return (
            <div className="modal" onClick={this.props.onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-content-header">
                        <h3>{this.props.title}</h3>
                        <CrossButton onClick={this.props.onClose} />
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}