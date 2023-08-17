import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  rol: String,
  carts: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
  },
  fullName: String,
  last_connection: {
    type: Date,
    default: null,
  },
  documents: {
    type: [
      {
        name: {
          type: String,
        },
        status: {
          type: String,
        },
        fileName: {
          type: String,
        },
      },
    ],
  },
  contadorDocs: {
    type: Number,
    default: 0,
  },
});

const userModel = mongoose.model(collection, userSchema);
export default userModel;
