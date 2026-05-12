const express = require("express");
const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/wtwr_db";

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect(uri);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: `69fd1fd50045019fc790aaa2`,
  };
  next();
});

app.use("/", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
