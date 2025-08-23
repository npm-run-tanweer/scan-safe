import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    region: { type: String, required: true },
    clerkId: { type: String, required: true},
    allergens: {type: Array},
    conditions: {type: Array},
    isVegan: {type: Boolean, required: true},
    allergyLevel: {type: String, required: true}
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
