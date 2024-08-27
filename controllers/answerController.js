//db connection
const dbConnection = require("../dbConfig");

const { StatusCodes } = require("http-status-codes");

const getAnswers = async (req, res) => {
  const { question_id } = req.params;

  // Validate question_id
  if (!question_id) {
    return res
      .status(400)
      .json({ error: "Bad Request", message: "Invalid question ID" });
  }

  try {
    // Query to fetch answers for the specified question_id
    const [rows] = await dbConnection.query(
      "SELECT answer_id, content, user_name, created_at FROM answers WHERE question_id = ? ORDER BY answer_id DESC",
      [question_id]
    );

    // Check if any answers were found
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No answers found for the specified question ID.",
      });
    }

    // Send successful response with answers
    res.status(200).json({
      answers: rows,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};
const postAnswer = async (req, res) => {
  const { answer } = req.body;
  const { question_id } = req.params; // Get question_id from URL parameters

  const user_name = req.user?.username;
  // Validate input
  if (!question_id || !answer || typeof answer !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  // Validate if user is authenticated
  if (!user_name) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized", message: "User not authenticated" });
  }

  try {
    // Insert the new answer into the database
    const result = await dbConnection.query(
      "INSERT INTO answers (question_id, user_name, content, created_at) VALUES (?, ?, ?, NOW())",
      [question_id, user_name, answer]
    );

    // Check if the insertion was successful
    if (result[0].affectedRows > 0) {
      return res.status(201).json({ message: "Answer posted successfully" });
    } else {
      return res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
    }
  } catch (error) {
    console.error("Database insertion error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { postAnswer, getAnswers };
