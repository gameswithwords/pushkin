import express from 'express';
import amqp from 'amqplib';
import uuid from 'uuid/v4';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
// import rpc from './rpc.js';
//import trim from './trim.js';
//import coreRouter from './coreRouter.js';

export default class PushkinAPI {
	constructor(expressPort, amqpAddress) {
		this.expressPort = expressPort;
		this.amqpAddress = amqpAddress;
		this.initialized = false;

		this.app = express();
		this.app.set('trust-proxy', 1);
		this.app.use(cookieSession({
			name: 'session',
			maxAge: 24 * 60 * 60 * 1000,
			keys: ['oursupersecrectkeyforpreventingcookietampering']
		}));
		this.app.use( (req, res, next) => {
			req.session.id = req.session.id || uuid();
			console.log(`API got request for ${req}`);
			next();
		});
		this.app.use(bodyParser.json());
		// this.app.use(cors()); // look this up, too
		this.expressListening = false;
	}

	async init() {
		return amqp.connect(this.amqpAddress)
			.then(conn => {
				this.conn = conn;
				this.initialized = true;
				console.log('API init connected');
			})
			.catch(err => {
				console.log(`Error connecting to message queue: ${err}`);
			});
	}

	useController(route, controller) {
		if (this.expressListening)
			throw new Error('Unable to add controllers after the API has started.');
		console.log('API using controller');
		this.app.use(route, controller); }

	usePushkinController(route, pushkinController) {
		if (this.expressListening)
			throw new Error('Unable to add controllers after the API has started.');
		if (!this.initialized)
			throw new Error('The API must first be initialized by calling .init().');
		this.useController(route, pushkinController.getConnFunction()(this.conn));
	}

	//enableCoreRoutes() { this.usePushkinController('/api', coreRouter); }

	start() {
		this.expressListening = true;
		this.app.listen(this.expressPort, () => {
			console.log(`Pushkin API listening on port ${this.expressPort}`);
		});
	}

}
