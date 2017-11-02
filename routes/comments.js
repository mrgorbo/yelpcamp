"use strict";

const express = require("express"),
    router    = express.Router({mergeParams: true});

const Comment = require("../models/comments"),
    Camp      = require("../models/campground");
const middleware = require("../middleware/index.js");

//=========================================================
//          COMMENTS ROUTES
//=========================================================
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    let id = req.params.id;
    Camp.findById(id, function(err, campground) {
        if(err){
            alert("Sorry!!  There was an error...");
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});    
        }
    });
});
router.post("/", middleware.isLoggedIn, function(req, res) {
    let id = req.params.id;
    // lookup campground using ID
    Camp.findById(id, function(err, campground) {
        if(err){
            alert("Sorry!!  There was an error...");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new commnet
            let comment = req.body.comment;
            Comment.create(comment, function(err, comment) {
                if(err){
                    req.flash("error", "An error has occurred.  Please try again.")
                    console.log(err);
                } else {
                    // add username & id to the comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // save the comment
                    comment.save()
                    
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to show page
                    req.flash("success", "Successfully added your comment!")
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }   
    });
});
router.get("/:comment_id/edit", function(req, res) {
    let comment_id = req.params.comment_id;
    Comment.findById(comment_id, function(err, foundComment) {
        if(err) {
            res.render("back");
        } else {
            let id = req.params.id;
            res.render("comments/edit", {campground_id: id, comment: foundComment});
        }
    })
});
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    let comment_id = req.params.comment_id;
    let comment = req.params.comment;
    Comment.findByIdAndUpdate(comment_id, comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            let id = req.params.id;
            res.redirect("/campgrounds/"+id);
        }
    });
});
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    let id = req.params.comment_id;
    Comment.findByIdAndRemove(id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            let id = req.params.id;
            req.flash("success", "Comment has been deleted.")
            res.redirect("/campgrounds/"+id);
        }
    });
});

module.exports = router;
