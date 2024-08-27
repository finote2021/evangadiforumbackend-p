const router = require("express").Router();

//user controllers
const { register, login , checkUser} = require("../controllers/userController");

//auth Middleware
const {authMiddleware} = require("../middlewares/authMiddleware");

//register route
router.post("/register", register);

//login route
router.post("/login", login);

//check is user authenticated route
router.get("/checkUser", authMiddleware, checkUser);

module.exports = router;
