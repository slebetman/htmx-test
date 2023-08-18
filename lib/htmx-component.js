const Router = require('express').Router;

const route = Router();

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
 * @param {string} path 
 * @param {ComponentDefinition} def 
 */
function get(path, def) {
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
 * @param {ComponentDefinition} def 
 */
function post(path, def) {
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

module.exports = {
	get,
	post,
}