/**
 * Controller for notes
 * @param {express.Router} app 
 */
module.exports = function (app) {
	app.get('/inc', async (req,res,next) => {
		let n = req.query.n;
		n++;

		res.send(`<div hx-get="/inc?n=${n}" hx-target="this" hx-swap="outerHTML" style="cursor:pointer">${n}</div>`);
	})

	app.get('/', async (req,res,next) => {
		res.render('main', {
			layout: 'main'
		});
	})
}