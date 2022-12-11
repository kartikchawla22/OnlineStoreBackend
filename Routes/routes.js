var express = require("express");
var router = express.Router();
var controller = require("../controller/controller");

router.route("/insertItem").post(controller.insertItem);
router.route("/getItems").get(controller.getallItems);
router.route("/paymentSuccess").post(controller.paymentSuccess);

module.exports = router;
