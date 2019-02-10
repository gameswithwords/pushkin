import express from 'express';
import amqp from 'amqplib/callback_api';
import uuid from 'uuid/v4';
import cookieSession from 'cookie-session';
// import rpc from './rpc.js';
// import trim from './trim.js';
import coreRouter from './coreRouter.js';

export default class PushkinAPI {
	constructor(expressPort, amqpAddress) {
		this.expressPort = expressPort;
		this.amqpAddress = amqpAddress;

		this.app = express();
		this.app.set('trust-proxy', 1);
		this.app.use(cookieSession({
			name: 'session',
			maxAge: 24 * 60 * 60 * 1000,
			keys: ['oursupersecrectkeyforpreventingcookietampering']
		}));
		this.app.use( (req, res, next) => {
			req.session.id = req.session.id || uuid();
			next();
		});
		// this.app.use(bodyParser.json()); // what is this?
		// this.app.use(cors()); // look this up, too
		this.expressListening = false;

		amqp.connect(this.amqpAddress, (err, conn) => {
			if (err)
				return console.log(`Error connecting to message queue: ${err}`);
			this.conn = conn;
		});
	}

	useController(route, controller) {
		if (this.expressListening)
			throw new Error('Unable to add controllers after the API has started.');
		this.app.use(route, controller);
	}

	usePushkinController(route, pushkinController) {
		this.useController(route, pushkinController.getConnFunction()(this.conn));
	}

	enableCoreRoutes() { this.usePushkinController('/api', coreRouter); }

	start() {
		this.expressListening = true;
		this.app.listen(this.expressPort, () => {
			console.log(`Pushkin API listening on port ${this.expressPort}`);
		});
	}

}
