const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", v1Router);

app.listen(3000);
