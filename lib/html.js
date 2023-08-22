// Simple html template tag. Mostly used for compatibility with vscode lit-html extension

function escape (pre, val) {
	let value = val;

	if (value === undefined || value === null) {
		value = '';
	}

	if (pre.match(/\$$/)) {
		return pre.replace(/\$$/,'') + value;
	}
	return pre + String(value)
		.replaceAll('&', "&amp;")
		.replaceAll('<', "&lt;")
		.replaceAll('>', "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

const html = (strings,...values) => 
	strings
		.map(x => escape(x, values.shift()))  // collect all fragments
		.join('')                              // make it a string
		.replace(/\s+/g,' ');                  // minify

module.exports = html;
