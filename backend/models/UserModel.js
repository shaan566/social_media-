import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp:{
      type: String,
      default: null
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },

    lastOtp:{
      type: Date,
      default: null
    },
    otpExpiresAt:{
      type: Date,
      default: null
    },
    otpAttempts:{
      type: Number,
      default: 0
    }, 
  
  },
  { timestamps: true }
);


// Hash password before saving
userSchema.pre("save", async function () {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return 

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    // If password is changed, update passwordChangedAt (subtract 1 sec to ensure token generated before this is invalid)
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000
    }
   return 
  } catch (error) {
    (error)
  }
})

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}



const User =  mongoose.model("User", userSchema);

export default User;
