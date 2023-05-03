import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  // _id: mongoose.Schema.ObjectId,
  username: String,
  email: {type: String, required: true},
  name: String,
  sub: String,
  picture: String,
  friends: [{
    friendshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Friendship" },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User"}
  }]
}, {
  timestamps: true
})

export type UserType = InferSchemaType<typeof userSchema>
export const User = mongoose.model('User', userSchema)