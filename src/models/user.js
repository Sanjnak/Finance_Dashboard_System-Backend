const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: {
        values: ["admin", "analyst", "viewer"],
        message: `{VALUE} is not supported!`
      }
    },
    status: {
        type: String,
        enum: {
        values: ["active", "inactive"],
        message: `{VALUE} is not supported!`
      }
    }
});

module.exports = mongoose.model("User", userSchema);