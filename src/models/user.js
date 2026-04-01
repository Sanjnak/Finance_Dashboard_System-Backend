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

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}

userSchema.methods.verifyPassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
}


module.exports = mongoose.model("User", userSchema);