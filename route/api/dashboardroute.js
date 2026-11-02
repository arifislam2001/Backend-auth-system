const express = require("express");
const router = express.Router();
const dashboardcontroller = require("../../controller/dashboardcontroller");
const { protect, requiedAdmin } = require("../../middleware/authMiddleware");

router.use(protect)

router.get("/alluser", protect, dashboardcontroller.getallusercontroller);

router.get("/single-user/:id", protect, dashboardcontroller.getsingleusercontroller);

router.patch("/approved-user/:id", protect, requiedAdmin, dashboardcontroller.approvedUsercontroller);

router.patch("/deactive-user/:id", protect, requiedAdmin, dashboardcontroller.deactiveUsercontroller);

router.delete("/delete-user/:id", protect, requiedAdmin, dashboardcontroller.deleteUsercontroller);

router.patch("/update/:id", protect, requiedAdmin, dashboardcontroller.getuserupdate);

module.exports = router;