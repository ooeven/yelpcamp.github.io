var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    passport   = require("passport"),
    Campground = require("../models/campground"),
    Comment    = require("../models/comment");
    
//Root Route
router.get("/", function(req,res){
    res.render("landing");
});

//Register Route form
router.get("/register", function(req, res){
   res.render("register", {page: "register"}); 
});

//Register Logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    
    if(req.body.admin === "admin123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login Route form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
    
});
//Login Logic
//passport.aunthenticate is a middleware that runs between
//the route and the callback
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: " Welcome back to YelpCamp",
    failureFlash: " Please Log in again"
}));

//Logout Route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "You are now logged out");
   res.redirect("/campgrounds");
});

//USER PROFILE
router.get("/users/:id",function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User not found");
            res.redirect("/");
        }
        Campground.find().where("author.id").equals(foundUser._id).populate("comments").exec(function(err, campgrounds){
            if(err){
                req.flash("error", "User does not own any campground");
                res.redirect("back");
            }
        Comment.find().where("author.id").equals(foundUser._id).exec(function(err, comments){
            if(err){
                req.flash("error", "User does not own any comments");
                res.redirect("back");
            }
            res.render("users/show",{user: foundUser, campgrounds: campgrounds, comments: comments});
            });
        });
    });
});

module.exports = router;