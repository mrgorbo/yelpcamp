"use strict";

//==============================================================================
//          API SETUP
//==============================================================================
// require the dependencies
const express   = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    requests    = require("requests"),
    mOverride   = require("method-override"),
    flash       = require("connect-flash");

// require database models
const User  = require("./models/user"),
    Camp    = require("./models/campground"),
    Comment = require("./models/comments");
    
// require passport authentication modules
const passport    = require("passport"),
    localStrategy = require("passport-local"),
    localMongoose = require("passport-local-mongoose");

// require API routes
const commentRoutes  = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
// declare the app variable **VERY IMPORTANT**
const app = express();

// Use bluebird promise library for Mongoose
mongoose.Promise = require('bluebird');

//console.log(process.env.DATABASEURL)
// connect to the MongoDB databases
console.log("DATABASEURL - " + process.env.DATABASEURL)
mongoose.connect(process.env.DATABASEURL);

// set the view engine
app.set("view engine", "ejs");

// set up the passport functions
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================================================================
//          SET THE APP.USE FUNCTIONS          
//==============================================================================
app.use(express.static(__dirname + "/public"));
app.use(mOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
// sessions
app.use(require("express-session")({
    secret: "Morning cup of joe is the best by the campfire.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    // set the local user variable
    res.locals.currentUser = req.user;
    // set the alert message variables
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/*
    remove all the campground/comment data from the DB
*/ /*
Camp.remove({}, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("All campgrounds removed from local database.");
    }
});
Comment.remove({}, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("All comments removed from the local database.");
    }
})
*/

//==============================================================================
//          START THE API
//==============================================================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp is up and running!  Have fun folks!");
})