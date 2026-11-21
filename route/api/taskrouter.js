const express = require("express");
const router = express.Router();
const taskcontroller = require("../../controller/taskcontroller");
const { protect, requiedAdmin } = require("../../middleware/authMiddleware");

router.post("/create", protect, requiedAdmin, taskcontroller.createtask);
router.get("/alltask", protect, requiedAdmin, taskcontroller.getTask);
router.get('/task/:id', protect, requiedAdmin, taskcontroller.singletask);
router.delete('/taskdelete/:id' ,protect,  requiedAdmin, taskcontroller.taskdelete);
router.patch('/taskUpdate/:id' ,protect,  requiedAdmin, taskcontroller.taskUpdate);


module.exports = router;