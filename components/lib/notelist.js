const component = require('../../lib/htmx-component');
const { sticky } = require('./sticky');
const db = require('../../lib/db');

module.exports = component.get('/notelist', async ({ session }) => {
	const user = session.user;
	const list = await db('notes').where({ user: user.id }).orderBy(['index', 'id']);

	return `
	<div id="note-list">
		<style>${css}</style>
		<button id="create" hx-get="/note/edit/new" hx-target="#content">
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

const css = `
	#note-list .stickies {
		width: 190px;
		height: 220px;
		float: left;
		border: 1px solid #aaaaaa;
		overflow: hidden;
		margin: 10px;
		box-shadow: 3px 5px 8px #ccc;
	}

	#note-list .stickies .body {
		padding: 10px;
		cursor: default;
		height: calc(100% - 20px);
	}

	#note-list .stickies .body .content {
		width: 170px;
		font-size: 10pt;
	}

	#note-list .stickies .body .content img {
		max-width: 50%;
		height: auto;
	}

	#note-list .stickies h3 {
		margin: 0;
		padding: 0;
		cursor: default;
	}

	#note-list button#create {
		margin-bottom: 20px;
		padding: 5px;
	}

	#note-list .delete-btn {
		float: right;
		margin: 1px 5px;
		font-size: 20px;
		cursor: pointer;
	}

	.stickies pre code {
		font-size: 12px;
		overflow: hidden;
	}

	.stickies ul {
		padding-left: 20px;
	}
`;
