const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const v1Router = require("./v1Routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", v1Router);

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
