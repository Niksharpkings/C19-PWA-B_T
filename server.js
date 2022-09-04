
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");


const PORT = process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect('mongodb://localhost/budget', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// }).then(() => console.log('MongoDB Connected...'))
// .catch((err) => console.log(err));

// routes here
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});