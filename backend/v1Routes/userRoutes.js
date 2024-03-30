const express = require("express");
const z = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware");

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

	await Account.create({
		userId,
		balance: Math.floor(1 + Math.random() * 1000),
	});

	res.status(200).send({
		message: "User created successfully",
		token,
	});
});

const signinSchema = z.object({
	userName: z.string(),
	password: z.string(),
});

router.post("/signin", async (req, res) => {
	const body = req.body;
	const { success } = signinSchema.safeParse(body);
	if (!success) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}
	const existingUser = await User.findOne({
		userName: req.body.userName,
	});

	if (!existingUser) {
		return res.status(400).json({
			message: "Please check your credentials.",
		});
	}

	const isPasswordCorrect = await bcrypt.compare(
		req.body.password,
		existingUser.password,
	);
	if (!isPasswordCorrect) {
		return res.status(400).json({
			message: "Please check your credentials.",
		});
	}

	const userId = existingUser._id;
	const token = jwt.sign({ userId }, process.env.JWT_SECRET);
	res.status(200).send({
		message: "User signed in successfully",
		token,
	});
});

const updateSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	password: z.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
	const userId = req.userId;
	const body = req.body;
	const { success } = updateSchema.safeParse(body);
	if (!success) {
		return res.status(400).json({
			message: "At least one field is required",
		});
	}

	const user = await User.findById(userId);
	if (!user) {
		return res.status(400).json({
			message: "User not found",
		});
	}

	await User.updateOne(
		{
			_id: userId,
		},
		{ body },
	);

	res.status(200).send({
		message: "User updated successfully",
	});
});

router.get("/bulk", authMiddleware, async (req, res) => {
	const filter = req.query.filter || "";
	const users = await User.find({
		$or: [
			{
				firstName: {
					$regex: filter,
					$options: "i",
				},
			},
			{
				lastName: {
					$regex: filter,
					$options: "i",
				},
			},
		],
	});

	res.status(200).send({
		users: users.map((user) => ({
			userName: user.userName,
			firstName: user.firstName,
			lastName: user.lastName,
			_id: user._id,
		})),
	});
});

module.exports = router;
