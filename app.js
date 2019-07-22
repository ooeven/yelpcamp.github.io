var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    User                  = require("./models/user"),
    SeedDB                = require("./seeds"),
    flash                 = require("connect-flash");

//Require Routes
var authRoutes            = require("./routes/authentication"),
    campgroundRoutes      = require("./routes/campgrounds"),
    commentRoutes         = require("./routes/comments");


//=======connect to local host=======
// mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true, useCreateIndex : true});
//===================================
//=======connect to heroku host=======
// mongoose.connect('mongodb+srv://ooeven:9enqqjC23ISbt8wE@cluster0-j1e8t.mongodb.net/test?retryWrites=true&w=majority', {
// 	useNewUrlParser : true,
// 	useCreateIndex : true,
// 	useFindAndModify: false,
// }).then(() => {
// 	console.log("Connected to DB!") ;
// }).catch(err => {
// 	console.log(err.message) ;
// });
//===================================
//export sensitive information that we don't want other to use by using env.DATABASEURL
//and setting backup DB.
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcamp";
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex : true,});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//lets us use the PUT and DELETE methods
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
// SeedDB(); //seed the database

//======================
//Passport Configuration
//======================
app.use(require("express-session")({
   secret: "YelpCamp Authentication",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use will check if req.username is empty and
//uses it on all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3050;
app.listen(port, function () {
  console.log("Server started!");
});
