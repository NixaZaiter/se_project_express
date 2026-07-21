const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middleware/error-handler");

const uri = "mongodb://127.0.0.1:27017/wtwr_db";

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect(uri);

app.use(express.json());
app.use(cors());

app.use("/", require("./routes/index"));

app.use(errorHandler);

app.listen(PORT, () => {});
