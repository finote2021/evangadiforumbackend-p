//db connection
const dbConnection = require("../dbConfig");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  // Validate request body
  if (!email || !firstname || !lastname || !username || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields.",
    });
  }

  if (password.length < 8)
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Password must be at least 8 characters.",
    });

  try {
    const [user] = await dbConnection.query(
      // Check for existing user
      "SELECT username, userid from users WHERE username = ? or email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Conflict", msg: "You've alrwady registered." });
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES(?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User created successfully." });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: "Internal Server Error",
        msg: "Something went wrong, try again later",
      });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT userid, username, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (isMatch) {
      const token = jwt.sign(
        { username: user[0].username, userid: user[0].userid },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      res.status(200).json({
        message: "User login successful",
        token: token,
      });
    } else {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid credentials" });
    }
  } catch (error) {
    // console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

const checkUser = (req, res) => {
  // Access user info from the request object
  const { username, userid } = req.user;
  // Send user info
  return res.status(StatusCodes.OK).json({
    message: "Valid user",
    username,
    userid,
  });
};


module.exports = { register, login, checkUser };
