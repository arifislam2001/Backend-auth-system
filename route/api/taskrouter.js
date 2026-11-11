const express = require("express");
const router = express.Router();
const taskcontroller = require("../../controller/taskcontroller")
const { protect, requiedAdmin } = require("../../middleware/authMiddleware");

router.post("/create" ,protect, requiedAdmin, taskcontroller.createtask)
router.post("/alltask" ,protect, requiedAdmin, taskcontroller.getTask)


module.exports = router