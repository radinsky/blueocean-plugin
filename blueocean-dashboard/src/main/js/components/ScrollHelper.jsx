import React, { Component } from 'react';

/**
 * Will inject the following functions as properties into the component which is using this.
 *
 *  * scrollBottom
 *  * scrollToAnchorTimeOut
 *  * scrollToAnchor
 *
 *  Sample usage:
 * @example export default scrollHelper(LogConsole);
 *
 * @param ComposedComponent
 */
const scrollHelper = ComposedComponent => class extends Component {
    render() {
        // React needs the timeout to have the dom ready
        const scrollToAnchorTimeOut = (timeout = 1) => setTimeout(() => this.scrollToAnchor(), timeout);
        // create a composedComponent and inject the functions we want to expose
        return (<ComposedComponent
          {...this.props}
          {...this.state}
          scrollBottom={this.scrollBottom}
          scrollToAnchorTimeOut={scrollToAnchorTimeOut}
          scrollToAnchor={this.scrollToAnchor}
        />);
    }
};

// Find the modal view container and adopt the scrollTop to focus the end
scrollHelper.scrollBottom = function scrollBottom() {
    const nodes = document.getElementsByClassName('content');
    const element = nodes[0];
    if (element) {
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }
};

// This will scroll to the hash that is selected in the window.location
// We assume an element having the id
scrollHelper.scrollToAnchor = function scrollToAnchor() {
    const anchorName = window.location.hash;
    if (anchorName) {
        const anchorElement = document.getElementById(anchorName.replace('#', ''));
        if (anchorElement) {
            anchorElement.scrollIntoView();
        }
    }
};

export default scrollHelper;
