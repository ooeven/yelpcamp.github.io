var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

function SeedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Campgrounds have been removed");    
    });
    Comment.remove({}, function(err){
        if(err){
            console.log(err); 
        }
    });
}
module.exports = SeedDB;