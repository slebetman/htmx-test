const component = require('express-htmx-components');
const noteList = require('./lib/notelist');
const login = require('./lib/login');

const main = component.get('/notes', async ({ session }, hx) => {
	const user = session.user;
	let logout = '';

	hx.set('HX-Refresh', 'true');

	if (user) {
		logout = `<a href="/notes/logout" class="logout-btn">
			<style>${logoutCss}</style>
			<span class="material-icons-outlined">
				logout
			</span>
			logout
		</a>`;
	}

	return `
	<style>${css}</style>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />

	<div id="header">
		<h1 id="title">
			<a href="/notes" style="text-decoration:none; color:black">
				<span class="material-icons-outlined" style=font-size: 1.4em; vertical-align:bottom">
					sticky_note_2
				</span>
				NOTES
			</a>
		</h1>
		<span id="username">${user ? user.name : ''}</span>
		<div id="logout">${logout}</div>
	</div>

	<div id="content">
		${user ? await noteList.html({ session }) : login.get.html({ session })}
	</div>
	`;
});

const logout = component.get('/notes/logout', async ({ session }, { redirect }) => {
	delete session.user;
	await redirect('/notes');
});

const css = `
	#header h1#title {
		font-size: 36px;
		margin-bottom: 0;
	}

	#username {
		padding: 0;
		margin: 0;
		margin-left: 32px;
		font-size: 14px;
	}
`

const logoutCss = `
	#logout {
		position: absolute;
		right: 10px;
		top: 10px;
	}

	.logout-btn {
		text-decoration: underline;
		color: black;
	}

	.logout-btn .material-icons-outlined {
		vertical-align: middle;
		font-size: 18px;
	}
`;

module.exports = {
	main,
	logout,
};
