const find = require('find');
const express = require('express');

const route = express.Router();

function htmx (body) {
	return `<html>
	<head>
	<script
		src="https://unpkg.com/htmx.org@1.9.4"
		integrity="sha384-zUfuhFKKZCbHTY6aRR46gxiqszMk5tcHjsVFxnUo8VMus4kHGVdIYVbOYYNlKmHV"
		crossorigin="anonymous"
	></script>
	</head>
	<body>
		${body}
	</body>
	</html>
	`
}

/**
 * @callback ComponentDefinition
 * @param {Object} props
 */

/**
 * @callback Middleware
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

/**
 * @param {string} path 
 * @param {...(Middleware|ComponentDefinition)} fn
 */
function get(path, ...fn) {
	const def = fn.pop();
	route.get(path, async (req, res, next) => {
		const props = structuredClone({
			...req.query,
			...req.params,
		});
		props.session = req.session;
		try {
			const html = await def(props);
			res.send(htmx(html));
		}
		catch (err) {
			next(err);
		}
	})

	return {
		html: def,
		route: route,
	}
}

/**
 * @param {string} path 
 * @param {...Function} [fn]
 */
function post(path, ...fn) {
	const def = fn.pop();
	route.post(path, async (req, res, next) => {
		const props = structuredClone({
			...req.body,
			...req.params,
		});
		props.session = req.session;
		try {
			const html = await def(props);
			res.send(htmx(html));
		}
		catch (err) {
			next(err);
		}
	})

	return {
		html: def,
		route: route,
	}
}

/**
 * @param {express.Router} app 
 * @param {string} componentsDir
 */
function init (app, componentsDir) {
	return new Promise((ok,fail) => {
		find.eachfile(/\.js$/, componentsDir, module => {
			const component = require(module);
			app.use(component.route);
		})
		.error(fail)
		.end(ok);
	});
}

module.exports = {
	get,
	post,
	init,
}