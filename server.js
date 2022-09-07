
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

// mongoose.connect('mongodb://localhost/budget', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//     .then(() => console.log('MongoDB Connected...'))
//     .catch((err) => console.log(err))
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/pwa-budget-tracker", {
  useNewUrlParser: true,
})
  // .then(() => console.log('MongoDB Connected...'))
  // .catch((err) => console.log(err));
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, '😡 MongoDB connection error:'));
// routes here
app.use(require("./routes/api.js"));

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

app.listen(PORT, () => {
  console.log(`
  Connection 🟢
  ${today.toUTCString()} 
  Budget-Tracker App ⚡On 127.0.0.1:${PORT}!✅ 
  Performance:${performance.now()}
  `);
});