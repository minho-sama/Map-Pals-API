require('dotenv').config()
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');
const authRouter = require('./routes/auth');
const markerRouter = require('./routes/marker');

const app = express();
app.use(cors());

//Set up mongoose connection
const mongoose = require('mongoose');
const connection = require("./db");
const Grid = require("gridfs-stream");
let gfs;
connection()
"https://github.com/aheckmann/gridfs-stream/issues/135"
"https://stackoverflow.com/questions/59717140/how-to-replace-gridstore-to-gridfsbucket"

const conn = mongoose.connection
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', accountRouter);
app.use('/', authRouter);
app.use('/', markerRouter);


//media routes for displaying and deleting images (needs to be in app.js)
//to get image: example in index.js
app.get("/file/:filename", async (req, res) => {
  try {
      const file = await gfs.files.findOne({ filename: req.params.filename });
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
  } catch (error) {
      res.send("not found");
  }
});

app.delete("/file/:filename", async (req, res) => {
  try {
      await gfs.files.deleteOne({ filename: req.params.filename });
      res.send("success");
  } catch (error) {
      console.log(error);
      res.send("An error occured.");
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
