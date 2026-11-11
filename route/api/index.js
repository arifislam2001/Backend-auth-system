const express = require("express");
const router = express.Router();


const authroute = require("./authrouter");
const productRoute = require("./productRoute");
const paymentrouter = require("./paymentrouter")
const dashboardroute = require("./dashboardroute")
const taskrouter = require("./taskrouter")


router.use("/auth", authroute);
router.use("/product", productRoute);
router.use("/payment" , paymentrouter)
router.use("/dashboard" , dashboardroute)
router.use("/task" , taskrouter )

module.exports = router;