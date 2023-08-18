const component = require('../../lib/htmx-component');

module.exports = component.get('/main/name',({ session, name, reset }) => {
	if (name) {
		session.name = name;
	}

	if (reset) {
		delete session.name;
	}

	function renderName () {
		if (session.name) {
			return `${session.name} <button hx-get="/main/name?reset=true" hx-target="#name-container" hx-swap="outerHTML">reset</button>`
		}
		else {
			return `<form hx-get="/main/name" hx-target="#name-container" hx-swap="outerHTML">
				<input name="name" id="name" type="text">
				<button type="submit">Submit</button>
			</form>`
		}
	}

	const css = `
	#name-container {
		width: 300px;
		text-align: center;
		margin: 20px;
		padding: 10px;
		border: 1px solid #999;
		border-radius: 10px;
	}`

	return `<div id="name-container">
		<style>${css}</style>

		/main/name

		<h2>Hello ${renderName()}</h2>
	</div>`
})