var mongoose = require("mongoose");

// Campground Schema setup
var campSchema = new mongoose.Schema({ 
    name: String,
    image: String,
    description: String,
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
        }],
    rating: Number,
    price: String
});
var Camp = mongoose.model("Camp", campSchema);

module.exports = Camp;