import mongoose from "mongoose";

const collection = "ticketsCodes";

const ticketCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expireAt: { type: Date, expires: 3600 },
});
const ticketCodeModel = mongoose.model(collection, ticketCodeSchema);
export default ticketCodeModel;
