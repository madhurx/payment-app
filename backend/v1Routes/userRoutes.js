const express = require("express");
const z = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const signupSchema = z.object({
	userName: z.string(),
	password: z.string(),
	firstName: z.string(),
	lastName: z.string(),
});
router.post("/signup", async (req, res) => {
	const body = req.body;
	const { success } = signupSchema.safeParse(body);
	if (!success) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}

	const existingUser = await User.findOne({
		userName: req.body.userName,
	});
	if (existingUser) {
		return res.status(400).json({
			message: "User already exists",
		});
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = await User.create({
		userName: req.body.userName,
		password: hashedPassword,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	});

	const userId = user._id;
	const token = jwt.sign({ userId }, process.env.JWT_SECRET);

	res.status(200).send({
		message: "User created successfully",
		token,
	});
});

module.exports = router;
