import React, { Component, PropTypes } from 'react';
import {
    CommitHash, ReadableDate, LiveStatusIndicator, TimeDuration,
}
    from '@jenkins-cd/design-language';
import { ReplayButton, RunButton } from '@jenkins-cd/blueocean-core-js';

import Extensions from '@jenkins-cd/js-extensions';
import moment from 'moment';

import { MULTIBRANCH_PIPELINE, SIMPLE_PIPELINE } from '../Capabilities';
import { buildRunDetailsUrl } from '../util/UrlUtils';
import IfCapability from './IfCapability';


/*
 http://localhost:8080/jenkins/blue/rest/organizations/jenkins/pipelines/PR-demo/runs
 */
export default class Runs extends Component {
    constructor(props) {
        super(props);
        this.state = { isVisible: false };
    }
    render() {
        // early out
        if (!this.props.result || !this.context.pipeline) {
            return null;
        }
        const {
            context: {
                router,
                location,
                pipeline: {
                    _class: pipelineClass,
                    fullName,
                    organization,
                },
            },
            props: {
                result: {
                    durationInMillis,
                    estimatedDurationInMillis,
                    pipeline,
                    id,
                    result,
                    state,
                    startTime,
                    endTime,
                    commitId,
                },
                changeset,
            },
        } = this;

        const resultRun = result === 'UNKNOWN' ? state : result;
        const running = resultRun === 'RUNNING';
        const durationMillis = !running ?
            durationInMillis :
            moment().diff(moment(startTime));

        const open = () => {
            const pipelineName = decodeURIComponent(pipeline);
            location.pathname = buildRunDetailsUrl(organization, fullName, pipelineName, id, 'pipeline');
            router.push(location);
        };

        const openRunDetails = (newUrl) => {
            location.pathname = newUrl;
            router.push(location);
        };

        return (<tr key={id} onClick={open} id={`${pipeline}-${id}`} >
            <td>
                <LiveStatusIndicator
                  result={resultRun}
                  startTime={startTime}
                  estimatedDuration={estimatedDurationInMillis}
                />
            </td>
            <td>{id}</td>
            <td><CommitHash commitId={commitId} /></td>
            <IfCapability className={pipelineClass} capability={MULTIBRANCH_PIPELINE} >
                <td>{decodeURIComponent(pipeline)}</td>
            </IfCapability>
            <td>
                {changeset && changeset.msg}
                {!changeset && '-'}
            </td>
            <td><TimeDuration millis={durationMillis} liveUpdate={running} /></td>
            <td><ReadableDate date={endTime} liveUpdate /></td>
            <td>
                <Extensions.Renderer extensionPoint="jenkins.pipeline.activity.list.action" />
                <RunButton className="icon-button" runnable={this.props.pipeline} latestRun={this.props.run} buttonType="stop-only" />
                { /* TODO: check can probably removed and folded into ReplayButton once JENKINS-37519 is done */ }
                <IfCapability className={pipelineClass} capability={[MULTIBRANCH_PIPELINE, SIMPLE_PIPELINE]}>
                    <ReplayButton className="icon-button" runnable={this.props.pipeline} latestRun={this.props.run} onNavigation={openRunDetails} />
                </IfCapability>
            </td>
        </tr>);
    }
}
const { shape, node } = PropTypes;

Runs.propTypes = {
    run: shape,
    pipeline: shape,
    result: node.isRequired, // FIXME: create a shape
    changeset: shape.isRequired,
};
Runs.contextTypes = {
    pipeline: shape,
    router: shape.isRequired, // From react-router
    location: shape,
};
