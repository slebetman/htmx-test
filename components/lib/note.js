const component = require('../../lib/htmx-component');
const db = require('../../lib/db');

const view = component.get('/note/view/:id', async ({ session, id }) => {
	const user = session.user;

	const note = await db('notes').where({ user: user.id, id: id }).first();

	if (note) {
		return viewer.html(note);
	}
	else {
		return 'Not Found';
	}
})

function goto (...path) {
	return `
		hx-get="${path.join('/')}"
		hx-target="#content"
	`
}

function gotoEditor (id) {
	return goto('/note/edit',id);
}

const viewer = component.get('/note/view', ({ id, title, color, content }) => {
	return `
		<div id="note">
			<style>${css}</style>
			<div class="input-group" ${gotoEditor(id)}>
				<h3>${title}</h3>
			</div>
			<div class="input-group" ${gotoEditor(id)}>
				<div id="body"
					style="background-color: ${color}"
				>${content}</div>
			</div>
			<div class="input-group">
				<button ${goto('/notelist')}>
					Back
				</button>
			</div>
		</div>
	`;
})

const edit = component.get('/note/edit/:id', async ({ session, id }) => {
	const user = session.user;

	const note = id === 'new' ?
		{ id: null } : await db('notes').where({ user: user.id, id: id }).first();

	if (note) {
		return editor.html(note);
	}
	else {
		return 'Not Found';
	}
})

const editor = component.get('/note/edit', ({ id, title, color, content }) => {
	return `
		<div id="note">
			<style>${css}</style>
			<div class="input-group">
				<input type="text" id="title" value="${title || ''}" />
				${ '' /* <ColorPicker value={color} onChange={c => setColor(c)} /> */ }
			</div>
			<div class="input-group">
				<textarea id="body"
					style="background-color: ${color || '#FFFFFF'}"
				>${content || ''}</textarea>
			</div>
			<div class="input-group">
				<button>
					Save
				</button>
				<button ${id === null ?
					goto('/notes') : goto('/note/view',id)
				}>
					Cancel
				</button>
			</div>
		</div>
	`;
})

const save = component.post('/note/edit/:id', ({ session, id }) => {

})

css = `
	#note .input-group {
		margin-bottom: 20px;
	}

	#note .input-group #title {
		width: calc(100% - 20px);
		display: inline;
	}

	#note .input-group h3 {
		padding: 0px 10px;
	}

	#note .input-group button {
		width: 150px;
		padding-left: 0;
		padding-right: 0;
		margin-left: 10px;
		float: right;
	}

	#note .input-group #body {
		width: calc(100% - 20px);
		height: calc(100vh - 260px);
		font-family: monospace;
		font-size: 10pt;
		margin: 0;
		padding: 5px 10px;
		overflow: auto;
	}

	#note .input-group #body img {
		max-height: 60vh;
	}

	#note .input-group #body img[alt$="small"] {
		max-height: 25vh;
		max-width: 200px;
	}
	@media (max-width: 1024px) {
		#note .input-group #body {
			font-size: 16px;
			height: calc(100vh - 310px);
		}
	
		#note .input-group button {
			width: 120px;
		}
	}
`;

module.exports = {
	view,
	viewer,
	edit,
	editor,
	save,
}