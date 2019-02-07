import express from 'express';
import amqp from 'amqplib/callback_api';
import uuid from 'uuid/v4';
import cookieSession from 'cookie-session';
import rpc from './rpc.js';

export default class PushkinAPI {
	constructor(expressPort, amqpAddress) {
		this.expressPort = expressPort;
		this.amqpAddress = amqpAddress;
		this.app = express();
		this.appStarted = false; // don't want to add controllers after the app has started
	}

	useController(controller, route) {
		if (this.appStarted)
			throw new Error('Pushkin API has already begun listening. Controllers must be added beforehand.');
		this.app.use(
	}
}
