// Before compile time (prep time), this (and everything else in this folder) is moved to
// ${pushkin_front_end_quizzes_dir}, so all paths to modules located outside of this
// folder are relative to that root

import React from 'react';
import { browserHistory } from 'react-router';
import pushkinClient from 'pushkin-client';
const pushkin = new pushkinClient();
import jsPsych from 'pushkin-jspsych';
window.jsPsych = jsPsych; // for jsPsych plugin access

export default class test extends React.Component {

	constructor(props) {
		super(props);
		this.state = { loading: true, experimentComplete: false };
	}

	componentDidMount() { this.startExperiment(); }

	async startExperiment() {
		await pushkin.connect('/api/test');
		await pushkin.prepExperimentRun();
		await pushkin.loadScripts([
			'https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.0.4/plugins/jspsych-html-button-response.js',
			'https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.0.4/plugins/jspsych-instructions.js',
			'https://cdn.jsdelivr.net/gh/jspsych/jsPsych@6.0.4/plugins/jspsych-survey-text.js'
		]);
		const stimuli = await pushkin.getAllStimuli();
		const timeline = pushkin.setSaveAfterEachStimulus(stimuli);
		this.setState({ loading: false });
		browserHistory.listen(jsPsych.endExperiment);

		jsPsych.init({
			display_element: this.refs.jsPsychTarget,
			timeline: timeline,
			on_finish: this.endExperiment.bind(this)
		});
	}

	endExperiment() {
		this.setState({ experimentComplete: true });
		pushkin.endExperiment();
	}

	render() {
		return (
			<div id="jsPsychContainer"> 
				{ this.state.loading && (<h1>Loading...</h1>)}
				<div ref="jsPsychTarget" style={{ display: this.state.loading ? 'none' : 'block' }}></div>
				{ this.state.experimentComplete && (<h1>Thanks for participating</h1>) }
			</div>
		);
	}
}
