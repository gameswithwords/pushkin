# A Goal for a Simpler Pushkin

Pushkin-only works – with bit of work. It's clear it needs to be much simpler for our target audience. Here's a goal I for how the project could look along with what we need to do to get there.

## End-user Experience

**Client-side (using React with Webpack):**

```js
import pushkin from 'pushkin-client';
import jsPsych from 'jspsych';
import React from 'react';

export default class MyExperiment extends React.Component {

	constructor(props) {
		super(props);
		this.state = { loading: true, experimentComplete: false };
	};

	componentDidMount() { this.startExperiment(); };

	async startExperiment() {
		await pushkin.connect('api.mydomain.com/credentials/cookies/experimentname/etc');
		await pushkin.prepToRunExperiment();
		const stimuli = await pushkin.getAllStimuli();
		this.setState({ loading: false });
		const timeline = pushkin.saveAfterEachStimulus(stimuli);

		jsPsych.init({
			display_element: this.refs.jsPsychTarget,
			timeline: timeline,
			on_finish: data => { this.endExperiment() }
		});
	}

	async endExperiment() {
		this.setState({ experimentComplete: true });
		pushkin.endExperiment();
	}

	render() {
		return (
			<div id="jsPsychContainer"> 
				{ this.state.loading && (<h1>Loading...</h1>)}
				<div ref="jsPsychTarget" style={{ display: this.state.loading ? 'none' : 'block' }}></div>
				{ this.state.experimentComplete && (<h1>Thanks for participating</h1>)}
			</div>
		);
	}
}
```

In this outline, the experiment retrieves all of its stimuli from a database and tells Pushkin to save the data after each trial, which is done by appending a function to the `on_finish` field of each jsPsych stimuli in the timeline. Note that tested and working code exists that does this from last summer. The only difference in this outline is the existence of the "pushkin" package simplifying the process. All potential functionality (such as answer-dependent stimuli determined by a worker through ML) is retained; the simplification doesn't present any bottlenecks.

**Server-side:**

NPM packages are highly modularized and it makes sense to break the pieces of Pushkin into separate, single-focused packages if we take this route. Note that this was shown with the front end above (see the import statement). Pushkin can be made much more straightforward by separately packaging its front end, API, and worker(s).

* **API:**

  ```js
  import pushkin from 'pushkin-api';
  
  // defaults can, of course, be overridden,
  // but should not need to be in order to start
  const apiOptions = {
      messageServiceConnection: { url: "...", port: 1234 }
  };
  pushkin.start(apiOptions);
  ```

  Options (and their defaults) would include custom endpoints and different messaging service queue names.

* **Worker (stand-in):**

  ```javascript
  import pushkin from 'pushkin-worker';
  
  const workerOptions = {
      database: { url: "...", port: 1234, username: "a", password: "b" }
  };
  pushkin.start(workerOptions);
  ```

  Mirroring the API, the worker also has possible options for alternate queues and custom endpoints.



  *A Brief Note on Workers:* Workers are language agnostic and experiment-specific. One of their main purposes is to perform more complex analysis, such as ML, on data in real time – a job ill-suited for JS. Users looking to undertake such tasks will inevitably have to write their own code specific for their own needs. Nevertheless, we can provide a stand-in NPM package to bridge the gap between database and API, which is how worker templates are already working.

Since they're so modulated, workers and the API can easily be run within Docker containers. Setting up a database, web hosting, load balancing, etc. is not easily assisted programmatically (and is better left that way). While it doesn't make sense to tie users of an open-source project like Pushkin to any specific services, we could provide manuals to setup our common stack of AWS and Rancher (or whatever we decide to use). Note that load balancing is a task completely independent of the services running on it. Pushkin itself doesn't provide load balancing – the most we can do is provide recommendations and assistance in setting it up using a service we recommend, like Rancher.

---

## How We Can Get There

Completing the following would get us well on the way to having something that runs similarly to what's described above.

1. **Front End** Make the front-end JS module that works together with jsPsych into an NPM package. `module.exports` should include functions to connect, start, save, and end experiments, along with whatever other functionality is currently done more verbosely through exposed axios calls. This involves mostly the creation of a neat wrapper over the existing code that worked as of last summer.
2. **API Package** Allow the API to be installed via NPM and run on Node. (It appears) much of the code we need is already here. It simply needs to be packaged, provided with defaults, and given room for custom setup options.
3. **Worker Package** Similar to the API, package the already-working template, provide it with defaults corresponding to the API, and open up options for custom endpoints.
