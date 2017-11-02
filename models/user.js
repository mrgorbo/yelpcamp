var mongoose      = require("mongoose");
var localMongoose = require("passport-local-mongoose");

// define the user schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(localMongoose);

module.exports = mongoose.model("User", userSchema);