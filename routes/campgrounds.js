"use strict";

const express   = require("express"),
    router      = express.Router();

const Camp       = require("../models/campground");
const middleware = require("../middleware/index.js");

//=========================================================
//          CAMPGROUNDS ROUTES
//=========================================================
router.get("/", function(req, res) {
   // get all the campgrounds from the database
    Camp.find({}, function(err, allGrounds) {
        if(err) {
            alert("Sorry!!  There was an error...");
            console.log(err);
        } else {
            res.render("campgrounds/index", {grounds: allGrounds});
        }
    });
});
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");    
});
router.get("/:id", function(req, res) {
    // find the campground with provided ID tag
    let id = req.params.id;
    Camp.findById(id).populate("comments").exec(function(err, foundCamp) {
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds/show", {campground:foundCamp});
       }
    });
});

// CREATE - add a new campground to the database
router.post("/", middleware.isLoggedIn, function(req, res) {
    // create the newAuthor object
    let id = req.user._id;
    let user = req.user.username;
    let newAuthor = {
        id: id,
        username: user
    };
    // create the newCampground object
    let newName = req.body.name;
    let newImage = req.body.image;
    let newDesc = req.body.desc;
    let newRating = req.body.rating;
    let newPrice = req.body.price;
    let newCampground = {
       name: newName,
       image: newImage,
       description: newDesc,
       author: newAuthor,
       rating: newRating,
       price: newPrice
    };

    // add newCampground object to the database
    Camp.create(newCampground, function(err, newlyCreated){
         if(err){
            alert("Sorry!!  Something went wrong...");
            console.log(err);
        } else {
            console.log("Entry was saved into database.");
            console.log(newlyCreated);
           // redirect back to campgrounds page
           res.redirect("/campgrounds");
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Camp.findById(req.params.id, function(err, foundCamp) {
        res.render("campgrounds/edit", {campground: foundCamp});    
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update the selected campground
    let id = req.params.id;
    let camp = req.body.campground;
    Camp.findByIdAndUpdate(id, camp, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    let id = req.params.id;
    Camp.findByIdAndRemove(id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground has been deleted.")
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;