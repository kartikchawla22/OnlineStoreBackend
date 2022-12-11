const Item_Model = require("../Model/itemModel");
const orderModel = require("../Model/orderModel");
const response = require("../utils/response");
const url = require("url");
const paypalController = require("./paypalController");
const { AxiosError } = require("axios");

exports.insertItem = async (req, res) => {
  try {
    const { imageUrl, name, description, maxQuantity, price } = req.body;
    const item = await Item_Model.create({
      imageUrl,
      name,
      description,
      maxQuantity,
      price,
    });
    return response({ res, data: item });
  } catch (error) {
    response({ res, error });
  }
};
exports.getallItems = async (req, res) => {
  try {
    const items = await Item_Model.find();
    return response({ res, data: items.length ? items : null });
  } catch (error) {
    response({ res, error });
  }
};

exports.getOrderDetailsUsingToken = async (req, res) => {
  const { token } = req.body;
  try {
    const order = await orderModel.findOne({ token: token });
    return response({ res, data: order });
  } catch (error) {
    response({ res, error });
  }
};
exports.paymentSuccess = async (req, res) => {
  const { token } = req.body;
  try {
    const order = await orderModel.findOne({ token: token });
    const capturePaymentResponse =
      order.intent === intentEnum.authorize
        ? await paypalController.authorizePayment(
            order.captureOrderId,
            order.access_token
          )
        : await paypalController.capturePayment(
            order.captureOrderId,
            order.access_token
          );
    if (typeof capturePaymentResponse == AxiosError) {
      response({ res, capturePaymentResponse });
    }

    const updatedItem = await orderModel.findOneAndUpdate(
      { token: token },
      {
        paymentId: capturePaymentResponse.data.id,
        status: capturePaymentResponse.data.status,
        success: true,
        payer: {
          ...capturePaymentResponse.data["payment_source"]["paypal"],
          address: capturePaymentResponse.data["purchase_units"][0].shipping,
        },
        orderDateTime: new Date(capturePaymentResponse.data.create_time),
      },
      { new: true }
    );

    return response({ res, data: capturePaymentResponse.data });
  } catch (error) {
    response({ res, error });
  }
};
