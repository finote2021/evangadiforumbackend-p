const router = require("express").Router();

//answer controllers
const { getAnswers, postAnswer } = require("../controllers/answerController");

//auth middleware
const {authMiddleware} = require("../middlewares/authMiddleware");

//Get answers for a single question route
router.get("/:question_id", authMiddleware, getAnswers);

//Post answer for a single question route
router.post("/:question_id",authMiddleware, postAnswer);


module.exports = router;
