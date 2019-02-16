import pushkin from 'pushkin-api';

const api = new pushkin.API(process.env.PORT, process.env.AMQP_ADDRESS);
api.init()
	.then(() => {
		api.usePushkinController('/api/test', myQuizController);
		api.start();
	})
	.catch(err => {
		console.log(err);
	});
