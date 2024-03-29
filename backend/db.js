const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL);

const userSchema = mongoose.Schema({
	userName: String,
	password: String,
	firstName: String,
	lastName: String,
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
