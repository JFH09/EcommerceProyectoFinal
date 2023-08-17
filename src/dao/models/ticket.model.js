import mongoose from "mongoose";

const collection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ticketsCodes",
    unique: true,
  },
  purchase_dataTime: String,
  amount: Number,
  purchaser: String,
  infoPurchase: String,
  infoNoPurchase: String,
});

const ticketModel = mongoose.model(collection, ticketSchema);
export default ticketModel;
