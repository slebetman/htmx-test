const component = require('express-htmx-components');
const { html, css } = require('../../lib/tags');

module.exports = component.get('/main/counter/:cid',({ session, cid, cmd }) => {
	if (!session.counters) {
		session.counters = {};
	}

	let n = session.counters[cid] || 1;

	switch (cmd) {
		case 'inc': n++; break;
		case 'dec': n--; break;
		case 'reset': n=1; break;
	}

	session.counters = {
		...session.counters,
		[cid]: n,
	}

	const style = css`
		#${ cid } {
			width: 150px;
			text-align: center;
			margin: 20px;
			padding: 10px;
			border: 1px solid #999;
			border-radius: 10px;
		}

		#${ cid } h2 {
			font-size: 30px;
			color: #3366aa;
		}

		#${ cid } button {
			cursor: pointer;
			margin-bottom: 5px;
		}
	`

	return html`<div id="${ cid }">
		<style>${style}</style>

		/main/counter/${cid}

		<h2>${n}</h2>

		<button hx-get="/main/counter/${cid}?cmd=dec" hx-target="#${ cid }" hx-swap="outerHTML">
			-
		</button>

		<button hx-get="/main/counter/${cid}?cmd=inc" hx-target="#${ cid }" hx-swap="outerHTML">
			+
		</button>

		<button hx-get="/main/counter/${cid}?cmd=reset" hx-target="#${ cid }" hx-swap="outerHTML">
			Clear
		</button>
	</div>`
})
