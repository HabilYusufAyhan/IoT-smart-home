const router = require("express").Router();
const authController = require("../controllers/auth_controller");

router.get("/test", authController.saveData);
router.get("/getalldata", authController.getAllData);

module.exports = router;
