import mongoose, { Schema, InferSchemaType } from "mongoose";

const movieSchema = new Schema({
  cast: [],
  countries: [],
  directors: [],
  genres: [{ id: Number, name: String }],
  imdbId: String,
  imdbRating: Number,
  originalLanguage: String,
  originalTitle: String,
  overview: String,
  posterURL: String,
  runtime: Number,
  title: String,
  year: Number
})

export type MovieType = InferSchemaType<typeof movieSchema>
export const Movie = mongoose.model('Movie', movieSchema)