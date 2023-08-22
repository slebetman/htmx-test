// Simple html template tag. Mostly used for compatibility with vscode lit-html extension

const html = (strings,...values) => 
	strings
		.map(x => x + (values.shift() || ''))  // collect all fragments
		.join('')                              // make it a string
		.replace(/\s+/g,' ');                  // minify

module.exports = html;
