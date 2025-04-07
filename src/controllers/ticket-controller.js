const { StatusCodes } = require("http-status-codes");
const TicketService = require("../services/email-service");

const create = async (req, res) => {
  try {
    const response = await TicketService.createNotification(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: response,
      err: {},
      message: "Successfully registered an email reminder",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: response,
      err: error,
      message: "unable to register an email reminder",
    });
  }
};

module.exports = {
  create,
};
