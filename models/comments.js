var mongoose = require("mongoose");

// Comment Schema setup
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;