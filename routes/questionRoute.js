const router = require("express").Router();

//Question controllers
const {
  postQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
} = require("../controllers/questionController");

//auth Middleware
const {authMiddleware} = require("../middlewares/authMiddleware");

//All Questions route
router.get("/", authMiddleware, getAllQuestions);

//edit Question route
router.put("/edit/:question_id", authMiddleware, editQuestion);

//Single Question route
router.get("/:question_id", authMiddleware, getSingleQuestion);

// Post a Question route
router.post("/", authMiddleware, postQuestion);

module.exports = router;
