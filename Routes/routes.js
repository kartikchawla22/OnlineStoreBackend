var express = require("express");
var router = express.Router();
var controller = require("../controller/controller");

router.route("/paymentSuccess").post(controller.paymentSuccess);


module.exports = router;
