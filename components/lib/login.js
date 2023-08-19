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
`

const form = component.private(() => {
	return `
	<style>${css}</style>
	<div id="login">
		<form id="login-form" hx-post="/notes/login">
			<div class="row"><label for="email">Email:</label><input type="text" name="email"></div>
			<div class="row"><label for="pass">Password:</label><input type="text" name="pass"></div>
			<div class="row"><button type="submit">Login</button></div>
		</form>
	</div>
	`
})

const get = component.get('/notes/login',({ session }, hx) => {
	if (session.user) {
		hx.redirect('/notes');
	}
	else {
		return form.html();
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
		return form.html();
	}
})

module.exports = {
	get,
	post,
}