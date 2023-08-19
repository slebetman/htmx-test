const component = require('../../lib/htmx-component');

module.exports = component.get('/notelist',({ session }) => {
	const list = [];

	return `
	<div id="note-list">
		<button id="create" hx-get="/note/new">
			<span class="material-icons-outlined">
				note_add
			</span>
			New Note
		</button>
		<div>
			${list.map(note => `<div>
				title=${note.title}
				content=${note.content}
				color=${note.color}
				note_id=${note.id}
			</div>`)}
		</div>
	</div>
	`
})