import React from 'react';

import {TextInput} from './common/form_components.js';
import GoalManager from './state_managers/goal_manager.js';
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
            if (!this.props.visible)
            {
                return;
            }

            if (this.state.modalShown == ModalShown.NONE)
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
        let containerClasses = 'sidebar-container';
        let bodyClasses = 'sidebar-body';
        let closeClickableDivClasses = 'sidebar-close-clickable-div';   
        if (this.props.visible)
        {
            const sidebarShownClass = ' sidebar-shown';
            containerClasses += sidebarShownClass;
            bodyClasses += sidebarShownClass;
            closeClickableDivClasses += sidebarShownClass;
        }

        return (
            <div className={containerClasses}>
                <div className={bodyClasses}>
                    <h1 className="sidebar-title">Menu</h1>
                    <SidebarRowButton text="Add Goal" onClick={() => this._handleLaunchModal(ModalShown.ADD_GOAL)} />
                    <SidebarRowButton text="Possible Features"
                        onClick={() => this._handleLaunchModal(ModalShown.FEATURES)} />
                </div>
                <div className={closeClickableDivClasses} onClick={this.props.closeSidebar} />
                {this._renderModalShown()}
            </div>
        );
    }

    _renderModalShown = () =>
    {
        switch (this.state.modalShown)
        {
        case ModalShown.ADD_GOAL:
            return <ModalGoalEntryForm onClose={this._handleModalClose} />;

        case ModalShown.FEATURES:
            // TODO: better text here
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

class ModalGoalEntryForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {'name': ''};
    }

    _handleGoalNameChange = (event) =>
    {
        this.setState({'name': event.target.value});
    }

    _handleSubmit = () =>
    {
        GoalManager.addGoal(this.state.name)
            .done(this.props.onClose);
    }

    render()
    {
        return (
            <Modal title="Add Goal" onClose={this.props.onClose}>
                <TextInput label="Name" value={this.state.name} onChange={this._handleGoalNameChange}/>
                <button onClick={this._handleSubmit}>Submit</button>
            </Modal>
        );
    }
}