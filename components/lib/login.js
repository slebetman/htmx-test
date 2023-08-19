const component = require('../../lib/htmx-component');
const db = require('../../lib/db');
const bcrypt = require('bcryptjs');

const css = `
	#login {
		margin: 20vh auto;
		padding: 40px 20px;
		width: 400px;
		border: 1px solid #aaaaaa;
		border-radius: 10px;
		box-shadow: 3px 5px 8px #ccc;
	}

	#login .row {
		margin: 5px;
	}

	#login .row label {
		display: inline-block;
		width: 100px;
	}

	#login .row button {
		float: right;
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	.login-error {
		color: #ff0000;
		margin-left: 110px;
		animation: fadeOut 0.8s ease-out 3.3s;
	}
`

const form = component.private(({ error }) => {
	return `
	<div id="login" hx-ext="remove-me">
		<script src="https://unpkg.com/htmx.org/dist/ext/remove-me.js"></script>
		<style>${css}</style>
		<form id="login-form" hx-post="/notes/login" hx-target="#login" hx-swap="outerHTML">
			<div class="row"><label for="email">Email:</label><input type="text" name="email"></div>
			<div class="row"><label for="pass">Password:</label><input type="text" name="pass"></div>
			<div class="row"><button type="submit">Login</button></div>
		</form>

		${error? `<span class="login-error" remove-me="4s">${error}</span>` : ''}
	</div>
	`
})

const get = component.get('/notes/login',({ session }, hx) => {
	if (session.user) {
		hx.redirect('/notes');
	}
	else {
		return form.html({});
	}
})

const post = component.post('/notes/login',async ({ session, email, pass }, hx) => {
	const user = await db('users').where({ email }).first();

	if (user) {
		if (await bcrypt.compare(pass, user.password)) {
			session.user = user;
		}
	}

	if (session.user) {
		hx.redirect('/notes');
	}
	else {
		return form.html({ error: "Invalid login!" });
	}
})

module.exports = {
	get,
	post,
}