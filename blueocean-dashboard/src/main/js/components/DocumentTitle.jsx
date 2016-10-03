import React, { Component } from 'react';

/**
 * Will inject setTitle as properties into the component which is using this.
 *
 *  Sample usage:
 * @example export default documentTitle(Pipelines);
 * // then in your code in the place that fits best
 * this.props.setTitle('Dashboard Jenkins – Dashboard'):  *
 * // Do not forget to declare the prop
 * Pipelines.propTypes = {
 *   setTitle: func,
 * } *
 * @param ComposedComponent
 */
const documentTitle = ComposedComponent => class extends Component {

    render() {
        // create a composedComponent and inject the functions we want to expose
        return (<ComposedComponent
          {...this.props}
          {...this.state}
          setTitle={this.setTitle}
        />);
    }
};
/**
 * Set the title of the document
 * @param title {String}
 */
documentTitle.setTitle = function setTitle(title) {
    if (document) {
        document.title = title;
    }
};

export default documentTitle;
