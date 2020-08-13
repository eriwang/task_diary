import React from 'react';

import Modal from './common/modal.js';

const ModalShown = Object.freeze({
    'NONE': 0,
    'ADD_GOAL': 1,
    'FEATURES': 2
});

export default class CollapsibleSidebar extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            'modalShown': ModalShown.NONE
        };

        this.windowScrollX = null;
        this.windowScrollY = null;
    }

    componentDidMount()
    {
        window.addEventListener('scroll', () => {
            // The visible check isn't strictly necessary, but reduces the number of closeSidebar() calls (which
            // reduces calls to setState)
            if (this.props.visible && this.state.modalShown == ModalShown.NONE)
            {
                this.props.closeSidebar();
            }
            else
            {
                window.scrollTo(this.windowScrollX, this.windowScrollY);
            }
        });
    }

    _handleLaunchModal = (modalShown) =>
    {
        console.log(window.scrollX, window.scrollY);
        this.windowScrollX = window.scrollX;
        this.windowScrollY = window.scrollY;

        this.setState({'modalShown': modalShown});
    }

    _handleModalClose = () =>
    {
        this.setState({'modalShown': ModalShown.NONE});
    }

    render()
    {
        let className = this.props.visible ? 'sidebar-shown' : 'sidebar-hidden';
        return (
            <div className={className}>
                <div className="sidebar-body">
                    <h1 className="sidebar-title">Menu</h1>
                    <SidebarRowButton text="Add Goal" onClick={() => this._handleLaunchModal(ModalShown.ADD_GOAL)} />
                    <SidebarRowButton text="Possible Features"
                        onClick={() => this._handleLaunchModal(ModalShown.FEATURES)} />
                </div>
                <div className="sidebar-close-clickable-div" onClick={this.props.closeSidebar} />
                {this._renderModalShown()}
            </div>
        );
    }

    _renderModalShown = () =>
    {
        switch (this.state.modalShown)
        {
        case ModalShown.ADD_GOAL:
            return (<Modal title="Add Goal" onClose={this._handleModalClose}><p>Text here</p></Modal>);

        case ModalShown.FEATURES:
            return (
                <Modal title="Planned Features" onClose={this._handleModalClose}>
                    <p>There are a number of features I have in mind for this but haven&apos;t started work on.</p>
                </Modal>
            );

        case ModalShown.NONE:
            return null;
        }

        throw `Unknown ModalShown value ${this.state.modalShown}`;
    }
}

class SidebarRowButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <p className="sidebar-clickable-item" onClick={this.props.onClick}>{this.props.text}</p>
        );
    }
}
