import React, { Component, PropTypes } from 'react';
import { EmptyStateView } from '@jenkins-cd/design-language';
import Extensions, { dataType } from '@jenkins-cd/js-extensions';
import { actions as selectorActions, testResults as testResultsSelector,
    connect, createSelector } from '../redux';
import PageLoading from './PageLoading';

const EmptyState = () => (
    <EmptyStateView tightSpacing>
        <p>
            There are no tests run for this build.
        </p>
    </EmptyStateView>
);


/**
 * Displays a list of tests from the supplied build run property.
 */
class RunDetailsTests extends Component {
    componentWillMount() {
        this.props.fetchTestResults(
            this.props.result
        );
    }

    componentWillUnmount() {
        this.props.resetTestDetails();
    }

    render() {
        const { testResults } = this.props;

        if (!testResults || testResults.$pending) {
            return <PageLoading />;
        }
        
        if (testResults.$failed) {
            return <EmptyState />;
        }

        const percentComplete = testResults.passCount /
            (testResults.passCount + testResults.failCount);

        return (<div className="test-results-container">
            <div className="test=result-summary" style={{ display: 'none' }}>
                <div className={`test-result-bar ${percentComplete}%`} />
                <div className="test-result-passed">Passed {testResults.passCount}</div>
                <div className="test-result-failed">Failed {testResults.failCount}</div>
                <div className="test-result-skipped">Skipped {testResults.skipCount}</div>
                <div className="test-result-duration">Duration {testResults.duration}</div>
            </div>

            <Extensions.Renderer extensionPoint="jenkins.test.result" filter={dataType(testResults)} testResults={testResults} />
        </div>);
    }
}
RunDetailsTests.renderEmptyState = function renderEmptyState() {
    return (
      <EmptyStateView tightSpacing>
          <p>There are no tests for this pipeline run.</p>
      </EmptyStateView>
    );
};
RunDetailsTests.propTypes = {
    result: PropTypes.shape,
    testResults: PropTypes.shape,
    resetTestDetails: PropTypes.func,
    fetchTestResults: PropTypes.func,
};

RunDetailsTests.contextTypes = {
    config: PropTypes.shape.isRequired,
};

const selectors = createSelector([testResultsSelector],
    testResults => ({ testResults }));

export default connect(selectors, selectorActions)(RunDetailsTests);
