import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    personality: { type: String }, // <-- important, this saves personality result
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;