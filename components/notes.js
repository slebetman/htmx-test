const component = require('../lib/htmx-component');
const noteList = require('./lib/notelist');

module.exports = component.get('/notes',async ({ session }) => {
	const user = session.user;

	return `
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"></link>
	<link rel="stylesheet" href="/static/notes.css"></link>

	<div id="header">
		<h1 id="title" style="font-size:'40px'">
			<a href="/notes" style="text-decoration:none; color:black">
				<span class="material-icons-outlined" style=font-size: 1.4em; vertical-align:bottom">
					sticky_note_2
				</span>
				NOTES
			</a>
		</h1>
	</div>

	<div id="content">
		${noteList.html({ session })}
	</div>
	`
})