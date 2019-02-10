import pushkin from 'pushkin-api';

const myController = new pushkin.ControllerBuilder();
myController.setPass('/getAllStimuli', 'getAllStimuli', 'queue1');
myController.setPass('/doSomething2', 'crazyMethod', 'queue2');
myController.setPass('/endExperiment', 'finish', 'queue1');
myController.setDirectUse('/health', (req, res, next) => {
	res.send('obese');
}, 'get');

export default myController;
