#! /usr/bin/env node

const express = require('express');
const find = require('find');
const path = require('path');
const compress = require('express-compress').compress;
const create = require('express-handlebars').create;

const app = express();

const hbs = create({
	extname: '.hbs',
	layoutsDir: 'views/layouts',
	defaultLayout: false
});

app.engine('.hbs',hbs.engine);
app.set('view engine', 'hbs');
app.set('views',path.join(path.resolve(__dirname), "views"));

const CONTROLLERS_DIR = path.join(path.resolve(__dirname), 'controllers');

app.disable('x-powered-by');
app.enable('trust proxy');

app.use(compress({contentType: /html/}));

// Auto-load controllers:
find.eachfile(/\.js$/, CONTROLLERS_DIR, module => require(module)(app))
	.end(() => {
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
				errorMessage
			})
		})

		app.listen(8888,
			() => console.log(`Server started, listening on ${8888} ..`)
		);
	});