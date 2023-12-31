#! /usr/bin/env node

const express = require('express');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const compress = require('express-compress').compress;
const create = require('express-handlebars').create;
const components = require('express-htmx-components');
const controllers = require('./lib/controllers');
const conf = require('./lib/config');
const requestLogger = require('./lib/request-logger');

const app = express();

const hbs = create({
	extname: '.hbs',
	layoutsDir: 'views/layouts',
	partialsDir: 'views/components',
	defaultLayout: false,
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(path.resolve(__dirname), 'views'));

const CONTROLLERS_DIR = path.join(path.resolve(__dirname), 'controllers');
const COMPONENTS_DIR = path.join(path.resolve(__dirname), 'components');

app.disable('x-powered-by');
app.enable('trust proxy');

app.use(
	session({
		secret: 'xxx',
		resave: true,
		saveUninitialized: true,
		store: new FileStore({
			path: './sessions',
		}),
		cookie: {
			secure: false,
			httpOnly: true,
		},
	})
);

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(compress({ contentType: /html|js|css/ }));
app.use(requestLogger);

// Auto-load controllers:
controllers.init(app, CONTROLLERS_DIR).then(() => 
components.init(app, COMPONENTS_DIR, {
	css : [
		"https://fonts.googleapis.com/icon?family=Material+Icons+Outlined",
		"/static/notes.css",
	],
	js : [
		"https://unpkg.com/htmx.org/dist/ext/remove-me.js",
		"/static/color-picker.min.js"
	]
})).then(() => {
	app.use((req, res) => {
		console.log('404: Not Found');
		res.status(404);
		res.send('404: Not Found.');
	})

	// Error handler sends JSON instead of HTML
	app.use((err, req, res, next) => {
		if (err.code !== 'DONT_CARE') {
			console.error(err);
		}

		if (res.headersSent) {
			return next(err);
		}

		res.status(500);

		if (err.sqlMessage) {
			err.message = err.sqlMessage;
		}

		let errorMessage = err.message ? err.message : err;

		res.render('error', {
			errorMessage,
		});
	});

	app.listen(conf.port, () => console.log(`Server started, listening on ${conf.port} ..`));
});
