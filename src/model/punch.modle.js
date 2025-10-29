import mongoose from "mongoose";

const punchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  PunchIntime: { type: String, required: true },
  PunchOuttime: { type: String},
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

export const Punch = mongoose.models.Punch || mongoose.model("Punch", punchSchema);