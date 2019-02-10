import express from 'express';
import amqp from 'amqplib/callback_api';
import uuid from 'uuid/v4';
import cookieSession from 'cookie-session';
import rpc from './rpc.js';
import trim from './trim.js';
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

	passAlongMethod(route, method, queue) {
		return (req, res, next) => { // eslint-disable-line
			console.log(`${route} hit`);

			const rpcParams = { method: method, data: req.body, sessionId: req.session.id };

			rpc(this.conn, queue, rpcParams)
				.then(rpcRes => {
					try { console.log(`${route} response: ${trim(JSON.stringify(rpcRes), 100)}`); }
					catch (e) { console.log(`${route} response (failed to JSON.stringify): ${trim(rpcRes, 100)}`); }
					res.send({ resData: rpcRes });
				})
				.catch(rpcErr => {
					console.log('Error in API getting RPC response:');
					console.log(rpcErr);
					res.status(500).send(rpcErr);
				});
		};
	}

	// pass posts on this route to this method via this queue
	pass(route, method, queue) {
		if (this.expressListening)
			throw new Error('Unable to add passes after the API has started.');
		this.app.post(route, this.passAlongMethod(route, method, queue));
	}

	useCustomController(route, controller) {
		if (this.expressListening)
			throw new Error('Unable to add controllers after the API has started.');
		this.app.use(route, controller);
	}

	enableCoreRoutes() { this.useCustomController('/api', coreRouter); }

	start() {
		this.expressListening = true;
		this.app.listen(this.expressPort, () => {
			console.log(`Pushkin API listening on port ${this.expressPort}`);
		});
	}

}
