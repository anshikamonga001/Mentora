import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    avatar: String,

    role: {
      type: String,
      enum: ["student", "tutor", "freelancer", "admin"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    profileCompletion: {
      type: Number,
      default: 0,
    },

    /* =========================
       ✅ GOOGLE CALENDAR TOKENS
       ========================= */
    google: {
      accessToken: {
        type: String,
      },
      refreshToken: {
        type: String,
      },
      expiryDate: {
        type: Number, // timestamp from Google
      },
    },
  },
  { timestamps: true }
);

// 🔐 Hash password only for local users
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
