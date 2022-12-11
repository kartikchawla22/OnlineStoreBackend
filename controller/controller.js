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

exports.updateItem = async (item) => {
  try {
    const { itemId, imageUrl, name, description, maxQuantity, price, quantity } = item;
    const updatedItem = await Item_Model.findOneAndUpdate(
      { itemId: itemId },
      {
        imageUrl: imageUrl,
        name: name,
        description: description,
        maxQuantity: maxQuantity - quantity,
        price: price,
      },
      { new: true })
    return updatedItem
  } catch (error) {
    console.log(error);
  }
};
exports.placeOrder = async (req, res) => {
  try {
    const { data, total, intent } = req.body;
    const auth = await paypalController.paypalAuth()
    const { access_token } = JSON.parse(JSON.stringify(auth.data))
    const createOrderResponse = await paypalController.createOrder(access_token, total, intent)
    const { id, links, status } = JSON.parse(JSON.stringify(createOrderResponse.data))
    for (let i = 0; i < links.length; i++) {
      if (links[i].rel === "approve") {
        const url_parts = url.parse(links[i].href, true)
        const query = url_parts.query
        const { token } = query
        await orderModel.create({
          items: data,
          total: total,
          access_token: access_token,
          token: token,
          captureOrderId: id,
          intent: intent,
          status: status
        });
        await Promise.all(data.map(element => { this.updateItem(element) }))
        return response({ res, data: { url: links[i].href, id, access_token } });
      }
    }
  } catch (error) {
    response({ res, error });
  }
}

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

exports.getLastOrderDetails = async (req, res) => {
  try {
    const items = await orderModel.find().sort({ orderDateTime: -1 }).limit(1);
    return response({ res, data: items.length ? items : null });
  } catch (error) {
    response({ res, error });
  }
}
