const find = require("find");
const express = require("express");

const route = express.Router();

function htmx(body) {
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
	`;
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
 * @param {ComponentDefinition} fn
 */
function private(fn) {
	return {
		html: def,
	};
}

function makeComponent(method, path, ...fn) {
	const def = fn.pop();
	route[method](path, ...fn, async (req, res, next) => {
		const props = {
			...req.body,
			...req.params,
			...req.query,
		};
		props.session = req.session;

		if (method === "use") {
			props.method = req.method;
		}

		try {
			const html = await def(props);
			res.send(htmx(html));
		} catch (err) {
			next(err);
		}
	});

	return {
		html: def,
		route: route,
	};
}

/**
 * @param {string} path
 * @param {...(Middleware|ComponentDefinition)} fn
 */
function use(path, ...fn) {
	return makeComponent("use", path, ...fn);
}

/**
 * @param {string} path
 * @param {...(Middleware|ComponentDefinition)} fn
 */
function get(path, ...fn) {
	return makeComponent("get", path, ...fn);
}

/**
 * @param {string} path
 * @param {...Function} [fn]
 */
function post(path, ...fn) {
	return makeComponent("post", path, ...fn);
}

/**
 * @param {express.Router} app
 * @param {string} componentsDir
 */
function init(app, componentsDir) {
	return new Promise((ok, fail) => {
		find.eachfile(/\.js$/, componentsDir, (module) => {
			const component = require(module);
			if (component.route) app.use(component.route);
			else {
				// support multiple component
				for (const c in component) {
					if (c.route) app.use(c.route);
				}
			}
		})
			.error(fail)
			.end(ok);
	});
}

module.exports = {
	private,
	use,
	get,
	post,
	init,
};
