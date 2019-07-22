var middlewareObj = {},
    Campground    = require("../models/campground"),
    Comment       = require("../models/comment");

middlewareObj.checkCampgroundOwer = function(req, res, next){
    //is the user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found ");
                res.redirect("back");
           } else {
               // checks if the user owns the foundCampground
               // by comparing with the req.user._id
               //.equals lets us compare between String and an ObjectId
               if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", " You don't have permission");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwner = function(req, res, next){
    //is the user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
           } else {
               // checks if the user owns the foundComment
               // by comparing with the req.user._id
               //.equals lets us compare between String and an ObjectId
               if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "You don't have permission");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    // we request to see if the user is logged in
    if(req.isAuthenticated()){
        return next();
    }
    //flash is not used right away, used in the next request
    //must be before we redirect unless wont work
    //this is working in ("key", "value")
    req.flash("error", "Log in first");
    res.redirect("/login");
};

module.exports = middlewareObj;