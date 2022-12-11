var express = require("express");
var router = express.Router();
var controller = require("../controller/controller");

router.route("/insertItem").post(controller.insertItem);
router.route("/getItems").get(controller.getallItems);
router.route("/placeOrder").post(controller.placeOrder);
router.route("/paymentSuccess").post(controller.paymentSuccess);
router.route("/getOrderDetailsUsingToken").post(controller.getOrderDetailsUsingToken);
router.route("/getLastOrderDetails").get(controller.getLastOrderDetails);

module.exports = router;
