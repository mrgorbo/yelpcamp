//  REQUIRE THE DATABASE MODELS
var Comment = require("../models/comments"),
    Camp    = require("../models/campground");

//
//  FILE FOR STORING ALL THE CUSTOM MIDDLEWARE
//
var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
// check if the user is logged in and the owner of selected post
    if(req.isAuthenticated()) {
        // check if user owns the campground post
        Camp.findById(req.params.id, function(err, foundCamp) {
            if(err) {
                req.flash("error", "Campground not found.")
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id)) {
                    next();    
                } else {
                    req.flash("error", "You do not have permission to do that.")
                    res.redirect("back");
                }
                 
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}
middlewareObject.checkCommentOwnership = function(req, res, next) {
// check if the user is logged in and the owner of selected post
    if(req.isAuthenticated()) {
        // check if user owns the comment post
        console.log(req.params.id)
        Comment.findById(req.params.id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Comment not found.")
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();    
                } else {
                    req.flash("error", "You do not have permission to do that.")
                    res.redirect("back");
                }
                 
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

// check if the user is logged in
middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}


module.exports = middlewareObject;