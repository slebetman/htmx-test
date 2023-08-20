const component = require('../../lib/htmx-component');
const db = require('../../lib/db');

const sticky = component.get('/notes/sticky',({ id, color, title, content }) => {
	return `
	<div id="note-${id}" class="stickies"
		style="background-color:${color}"
		hx-get="/note/view/${id}"
		hx-target="#content"
	>
		<div class="delete-btn"
			hx-delete="/notes/sticky/${id}"
			hx-target="#note-${id}"
			hx-swap="none"
			hx-confirm="Delete this note?"
		>
			×
		</div>
		<div class="body">
			<h3>${title}</h3>
			<div className="content">
				${content}
			</div>
		</div>
	</div>
	`
})

const del = component.delete('/notes/sticky/:id',async ({ session, id }, hx) => {
	const user = session.user;
	await db('notes').where({ user: user.id, id }).delete();

	hx.set('HX-Reswap', 'delete');

	return '';
})

module.exports = {
	sticky,
	del,
}