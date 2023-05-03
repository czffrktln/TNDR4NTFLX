import mongoose, { Schema, InferSchemaType } from "mongoose";

const pairSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  status: String,
  moviesTheyChoosingFrom: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
  moviesSenderLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
  moviesSenderDisliked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
  moviesReceiverLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
  moviesReceiverDisliked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
}, {
  timestamps: true
})

export type PairType = InferSchemaType<typeof pairSchema>
export const Pair = mongoose.model('Pair', pairSchema)