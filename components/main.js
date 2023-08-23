const component = require('express-htmx-components');
const counter = require('./lib/counter');
const name = require('./lib/name');
const { html } = require('../lib/tags');

module.exports = component.get('/main',({ session }) => {
	if (!session.number) {
		session.number = Math.floor(Math.random() * 1000);
	}

	return html`
		<h1>This is a test</h1>

		$${name.html({ session })}

		$${counter.html({ session, cid: 'a' })}

		$${counter.html({ session, cid: 'b' })}

		$${counter.html({ session, cid: 'c' })}
	`
})
