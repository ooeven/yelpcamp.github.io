var mongoose              = require("mongoose"),
    passportLocalMongoone = require("passport-local-mongoose");
    
var userSchema = new mongoose.Schema({
    username: {type:String, unique: true, required: true},
    passport: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: String,
    isAdmin: {type: Boolean, default: false},
});

userSchema.plugin(passportLocalMongoone);

module.exports = mongoose.model("User", userSchema);