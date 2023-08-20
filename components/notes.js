const component = require('../lib/htmx-component');
const noteList = require('./lib/notelist');
const login = require('./lib/login');

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
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"></link>
	<link rel="stylesheet" href="/static/notes.css"></link>

	<div id="header">
		<h1 id="title" style="font-size:'40px'">
			<a href="/notes" style="text-decoration:none; color:black">
				<span class="material-icons-outlined" style=font-size: 1.4em; vertical-align:bottom">
					sticky_note_2
				</span>
				NOTES ${user ? `[ ${user.name} ]` : ''}
			</a>
		</h1>
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

module.exports = {
	main,
	logout,
};
