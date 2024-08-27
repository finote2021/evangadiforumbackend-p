const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { StatusCodes } = require("http-status-codes");

const authMiddleware = async (req, res, next) => {
  //This line retrieves the Authorization header from the incoming request. This header typically contains the token in the format 'Bearer <token>'.
  const token = req.headers.authorization;

  //Check if the token is present and correctly formatted:
  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication invalid" });
  }


  const jwtToken = token.split(" ")[1];
  try {
    const { username, userid } = jwt.verify(jwtToken, JWT_SECRET);
    req.user = { username, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication invalid" });
  }
};

module.exports = {authMiddleware};
