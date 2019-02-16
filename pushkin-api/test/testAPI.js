const pushkin = require('../build/index.js');
const myQuizController = require('./myQuizController.js');

const api = new pushkin.API(80, 'amqp://localhost:5672');
api.init()
	.then(() => {
		api.usePushkinController('/api/myQuiz', myQuizController);
		api.start();
	})
	.catch(err => {
		console.log(err);
	});
