const component = require('express-htmx-components');
const { html, css } = require('../../lib/tags');

module.exports = component.get('/main/name',({ session, name, reset }) => {
	if (name) {
		session.name = name;
	}

	if (reset) {
		delete session.name;
	}

	function renderName () {
		if (session.name) {
			return html`${session.name}
				<button hx-get="/main/name?reset=true" hx-target="#name-container" hx-swap="outerHTML">
					reset
				</button>`
		}
		else {
			return html`<form hx-get="/main/name" hx-target="#name-container" hx-swap="outerHTML">
				<input name="name" id="name" type="text">
				<button type="submit">Submit</button>
			</form>`
		}
	}

	const style = css`
	#name-container {
		width: 300px;
		text-align: center;
		margin: 20px;
		padding: 10px;
		border: 1px solid #999;
		border-radius: 10px;
	}`

	return html`<div id="name-container">
		<style>${style}</style>

		/main/name

		<h2>Hello $${renderName()}</h2>
	</div>`
})
