/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
	console.log(`${req.method} ${req.path}`, { ...req.query, ...req.body });
	next();
};
