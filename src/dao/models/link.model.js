import mongoose from "mongoose";

const collection = "links";

const linkCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expireAt: String,
});
const linkModel = mongoose.model(collection, linkCodeSchema);
export default linkModel;
