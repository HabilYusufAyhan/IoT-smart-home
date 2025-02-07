const Data = require("../model/user_model.js");
const saveData = async (req, res, next) => {
  const { io } = require("../../app");
  console.log(io);
  try {
    console.log(req.query);
    id = Number(req.query.id);
    let data = await Data.findOne({ id: id });
    if (!data) {
      data = new Data({ id });
    }
    data.x.push(req.query.x);
    data.y.push(req.query.y);
    data.z.push(req.query.z);
    data.gasStatus.push(req.query.gasstatus);
    data.temperature.push(req.query.temperature);
    data.smoke.push(req.query.smoke);
    data.times.push(Date.now());
    await data.save();
    io.emit("data", data);
    res.status(200).json({ message: "Data saved and emitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
const getAllData = async (req, res, next) => {
  console.log("data istedi");
  let data = await Data.find();
  return res.json(data);
};
module.exports = {
  saveData,
  getAllData,
};
