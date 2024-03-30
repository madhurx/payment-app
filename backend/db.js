const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

const userSchema = mongoose.Schema({
	userName: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		minLength: 3,
		maxLength: 20,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
	firstName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 30,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 30,
	},
});

const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	balance: {
		type: Number,
		required: true,
	},
});

const Account = mongoose.model("Account", accountSchema);

module.exports = { User, Account };
