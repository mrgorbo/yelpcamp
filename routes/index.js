"use strict";

const express = require("express"),
    router    = express.Router(),
    passport  = require("passport");

const User = require("../models/user");
    
//=========================================================
//          MAIN ROUTE
//=========================================================
router.get("/", function(req, res) {
   // this will be the main landing page for YelpCamp
   res.render("landing");
});

//=========================================================
//          REGISTER ROUTES
//=========================================================
router.get("/register", function(req, res) {
    res.render("authentication/register");
});
router.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username});
    let password = req.body.password;
    
    // register the new user in the database
    User.register(newUser, password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("authentication/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("sucess", "Welcome to YelpCamp" + user.username +"!");
            res.redirect("/campgrounds");    
        });
    });
});
router.put("/register", function(req, res) {
    // find and update the selected campground
    let id = req.params.id;
    let user = req.body.user;
    /*
    User.findByIdAndUpdate(id, password, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + id);
        }
    });
    */
});

//=========================================================
//          LOGIN & LOGOUT ROUTES
//=========================================================
router.get("/login", function(req, res) {
    res.render("authentication/login");
});
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out successfully!")
    res.redirect("/campgrounds");
});
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//=========================================================
//          FORGOT PASSWORD ROUTES
//=========================================================
router.get("/forgot", function(req, res) {
    res.render("authentication/forgot", {message: "None"}); 
});
router.post("/forgot", function(req, res) {
    var username = req.body.username;
    User.find({}, function(err, users) {
        if(err) {
            req.flash("error", err.message);
            res.render("authentication/forgot");
        } else {
            users.forEach(function(user) {
                if(user.username == username) {
                    res.render("authentication/forgot", {message: "Success", username: username}); 
                } else {
                    req.flash("error", "Username does not exist.");
                }
            });
        }
    });
});
module.exports = router;