var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   desc: String,
   createdAt: { type: Date, default: Date.not},
   author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
});
//Option 1
//var Campground = mongoose.model("Campground", campgroundSchema);
// module.exports = Campground;

//Option 2
module.exports = mongoose.model("Campground", campgroundSchema);