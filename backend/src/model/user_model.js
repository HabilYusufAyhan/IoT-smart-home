const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    x: {
      type: Array,
      default: [],
    },
    y: {
      type: Array,
      default: [],
    },
    z: {
      type: Array,
      default: [],
    },
    temperature: {
      type: Array,
      default: [],
    },
    smoke: {
      type: Array,
      default: [],
    },
    gasStatus: {
      type: Array,
      default: [],
    },
    times: {
      type: Array,
      default: [],
    },
  },
  { collection: "arduinodata", timestamps: true }
);

const Data = mongoose.model("arduinodata", UserSchema);

module.exports = Data;
