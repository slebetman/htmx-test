/**
 * Controller for notes
 * @param {express.Router} app 
 */
module.exports = function (app) {
	app.get('/inc', async (req,res,next) => {
		const cid = req.query.cid;
		let n = req.session.counters[cid];
		n++;

		req.session.counters = {
			... req.session.counters,
			[cid]: n,
		}

		res.render('components/counter', {n, cid});
	})

	app.get('/dec', async (req,res,next) => {
		const cid = req.query.cid;
		let n = req.session.counters[cid];
		n--;

		req.session.counters = {
			... req.session.counters,
			[cid]: n,
		}

		res.render('components/counter', {n, cid});
	})

	app.get('/reset', async (req,res,next) => {
		const cid = req.query.cid;
		let n = req.session.counters[cid];
		n = 0;

		req.session.counters = {
			... req.session.counters,
			[cid]: n,
		}

		res.render('components/counter', {n, cid});
	})

	app.get('/', async (req,res,next) => {
		if (!req.session.counters) {
			req.session.counters = {
				aa: 1,
				bb: 1,
			}
		}

		res.render('main', {
			layout: 'main',
			n: req.session.counters,
		});
	})
}