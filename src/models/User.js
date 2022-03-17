const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: "active",
    },
    userType: {
      type: String,
      trim: true,
      default: "user",
    },
    avatar: {
      type: String,
      trim: true,
      default:
        "data:image/png;base64,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",
    },
    farms: {
      type: Array,
      default: [],
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("farm", {
  ref: "Farm",
  localField: "_id",
  foreignField: "uid",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  if (!email || !password) {
    throw new Error("You must provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email Not Found !!!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong Password !!!");
  }

  return user;
};

// Hash the plain text password before save
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
