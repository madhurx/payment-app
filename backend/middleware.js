const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res.status(401).json({
			message: "Please provide a valid token",
		});
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = payload.userId;
		next();
	} catch (err) {
		return res.status(401).json({
			message: "Please provide a valid token",
		});
	}
};

module.exports = { authMiddleware };
