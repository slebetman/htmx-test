const find = require('find');
const Router = require('express').Router;

/**
 * @param {Router} app 
 * @param {string} controllersDir 
 */
function init (app, controllersDir) {
	return new Promise((ok,fail) => {
		find.eachfile(/\.js$/, controllersDir, module => require(module)(app))
			.error(fail)
			.end(ok);
	});
}

module.exports = {
	init,
}