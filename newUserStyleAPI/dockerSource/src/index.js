import pushkin from 'pushkin-api';
import myQuizController from './myQuizController.js';

const api = new pushkin.API(process.env.PORT, process.env.AMQP_ADDRESS);
api.usePushkinController('/api/myQuiz', myQuizController);
api.start();
