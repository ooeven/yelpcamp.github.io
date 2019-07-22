var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: "campgrounds"});
       }
    });
});

//CREATE ROUTE - Add new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    //retrive data from form and add to campground array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamground = {name: name, price: price, image: image, desc: desc, author: author};
    //create new campground and save to DB
    Campground.create(newCamground, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          //add username and id to newly campground
            newlyCreated.author.id = req.user._id;
            newlyCreated.author.username = req.user.username;
          res.redirect("/campgrounds");
      }
   });
});

//New - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW ROUTE - Show more info about specific campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwer, function(req, res) {
    //finding the specific campground to edit by id
    //although the "err" syntax we handled it in the checkCampgroundOwer function
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwer, function(req, res){
    //find and update the correct campground
    //take 3 arguments(id to find by, the data to updated with, callback to run afterwards)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect to the show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwer, function(req, res){
    //find campground by id and destroy campground
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;