const express = require("express");
const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/wtwr_db";

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect(uri);

app.use(express.json());

app.use("/", require("./routes/users"));
// app.use("/clothing-items", require("./routes/clothingItems"));

app.listen(PORT);
