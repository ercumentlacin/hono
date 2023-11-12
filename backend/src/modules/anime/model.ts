import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../user/model";

export interface IAnime {
  malId: number; // MyAnimeList ID
  title: string;
  imageUrl: string;
  lastCheckedEpisodeNumber: number;
  lastCheckedEpisodeDate: Date;
}

export interface IAnimeList extends Document {
  user: IUser["_id"];
  animes: IAnime[];
}

const animeSchema: Schema = new Schema({
  malId: { type: Number, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  lastCheckedEpisodeNumber: { type: Number, required: true, default: 0 },
  lastCheckedEpisodeDate: { type: Date, required: true, default: new Date(0) },
});

const animeListSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  animes: [animeSchema],
});

export const AnimeList = mongoose.model<IAnimeList>(
  "AnimeList",
  animeListSchema
);
