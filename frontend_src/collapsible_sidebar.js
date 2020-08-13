import React from 'react';

export default class CollapsibleSidebar extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        window.addEventListener('scroll', () => {
            // The visibility check isn't strictly necessary, but helps reduce the number of setState calls.
            if (this.props.visible)
            {
                this.props.closeSidebar();
            }
        });
    }

    render()
    {
        let className = this.props.visible ? 'sidebar-shown' : 'sidebar-hidden';
        return (
            <div className={className}>
                <div className="sidebar-body">
                    <p>Hello my name is Orc</p>
                    <p>Hello my name is Orc</p>
                </div>
                <div className="sidebar-close-clickable-div" onClick={this.props.closeSidebar} />
            </div>
        );
    }
}