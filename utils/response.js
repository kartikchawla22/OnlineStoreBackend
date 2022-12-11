const response = (obj) => {
  const { res, data = null, error = null } = obj;
  console.log(error);
  if (!data && !error) {
    return res.json({
      message: "Sorry No Data found",
    });
  }
  if (error) {
    return res.status(422).json({
      error,
      message: "There has been an Error",
    });
  } else {
    return res.json({
      data,
      message: "Success",
    });
  }
};
module.exports = response;
