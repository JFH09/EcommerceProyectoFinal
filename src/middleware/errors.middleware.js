import EnumErrors from "../utils/utils.errors/Enum.errors.js";
export default (error, req, res, next) => {
  console.log("CAUSA => ", error.cause);
  console.log(error.code);
  switch (error.code) {
    case EnumErrors.INVALID_TYPES_ERROR:
      res.json({ status: "error", error: error.name });
      break;
    case EnumErrors.ERROR_ROUTING:
      res.json({ status: "error", error: error.name });
      break;
    case EnumErrors.INVALID_CONTENT_INFO_ERROR:
      res.json({ status: "error", error: error.name });
      break;
    case EnumErrors.INVALID_USER_PERMISSIONS_ERROR:
      console.log({ status: "error2", error: error.code });
      res.json({ status: "error", error: error });
      break;
    default:
      res.json({ status: "error", error: "Unhandled error" });
  }
};
