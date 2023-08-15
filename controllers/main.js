/**
 * Controller for notes
 * @param {express.Router} app 
 */
module.exports = function (app) {
	app.get('/inc', async (req,res,next) => {
		let n = req.query.n;
		n++;

		res.render('components/counter', {n});
	})

	app.get('/dec', async (req,res,next) => {
		let n = req.query.n;
		n--;

		res.render('components/counter', {n});
	})

	app.get('/', async (req,res,next) => {
		res.render('main', {
			layout: 'main',
			n: 1,
		});
	})
}