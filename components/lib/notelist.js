const component = require('../../lib/htmx-component');
const { sticky } = require('./sticky');
const db = require('../../lib/db');

module.exports = component.get('/notelist', async ({ session }) => {
	const user = session.user;
	const list = await db('notes').where({ user: user.id }).orderBy(['index', 'id']);

	return `
	<div id="note-list">
		<button id="create" hx-get="/note/new">
			<span class="material-icons-outlined">
				note_add
			</span>
			New Note
		</button>
		<div>
			${list.map((note) => sticky.html(note)).join('')}
		</div>
	</div>
	`;
});
