/**
 * Controller for notes
 * @param {express.Router} app 
 */
module.exports = function (app) {
	app.get('/inc', async (req,res,next) => {
		let n = req.query.n;
		const cid = req.query.cid;
		n++;

		res.render('components/counter', {n, cid});
	})

	app.get('/dec', async (req,res,next) => {
		let n = req.query.n;
		const cid = req.query.cid;
		n--;

		res.render('components/counter', {n, cid});
	})

	app.get('/', async (req,res,next) => {
		res.render('main', {
			layout: 'main',
			n: 1,
		});
	})
}