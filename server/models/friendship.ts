import mongoose, { Schema, InferSchemaType } from "mongoose";

const friendshipSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  status: String
}, {
  timestamps: true
})

export type FriendshipType = InferSchemaType<typeof friendshipSchema>
export const Friendship = mongoose.model('Friendship', friendshipSchema)