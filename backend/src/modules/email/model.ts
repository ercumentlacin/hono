import mongoose, { Document, Schema } from "mongoose";

interface IEmailLog extends Document {
  userId: mongoose.Types.ObjectId;
  animeId: number;
  episodeNumber: number;
  sentDate: Date;
}

const emailLogSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  animeId: { type: Number, required: true },
  episodeNumber: { type: Number, required: true },
  sentDate: { type: Date, required: true, default: Date.now },
});

const EmailLog = mongoose.model<IEmailLog>("EmailLog", emailLogSchema);

export default EmailLog;
