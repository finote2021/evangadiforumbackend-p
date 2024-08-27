const dbConnection = require("../dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");


const postQuestion = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }
  try {
    const question_id = uuidv4();
  ///Will need to add created_at column in the db and insert the value now()
    await dbConnection.query(
      "insert into questions (question_id,title, description,user_name, created_at) values (?, ?,?,?, NOW())",
      [question_id, title, description, req.user.username]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Question added successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error.",
      message: "An unexpected error occurred.",
    });
  }
};

const getAllQuestions = async (req, res) => {
  try {

    const [questions] = await dbConnection.query(
      "SELECT title,description,question_id,user_name, created_at FROM questions JOIN users ON users.username = questions.user_name ORDER BY questions.id DESC"
    );
    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.log(error.message);
    // Send a response with HTTP status 500 (Internal Server Error) indicating that an unexpected error occurred.
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};


const getSingleQuestion = async (req, res) => {
  const question_id = req.params.question_id;
  try {
    const [rows] = await dbConnection.query(
      "SELECT * FROM questions WHERE question_id = ?",
      [question_id]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    const question = rows[0];
    return res.status(StatusCodes.OK).json(question);
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Some error occurred. Please try again" });
  }
};


const editQuestion = async (req, res) => {
  const { title, description } = req.body;
  const { question_id } = req.params;
  console.log(question_id);

  if (!title && !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No fields to update" });
  }

  try {
    let query = "UPDATE questions SET ";
    let updateValues = [];

    
    if (title) {
      query += "title = ?, ";
      updateValues.push(title);
    }

    if (description) {
      query += "description = ?, ";
      updateValues.push(description);
    }

  
    query = query.slice(0, -2);
    query += " WHERE question_id = ? AND user_name = ?";
    updateValues.push(question_id, req.user.username);

    console.log(question_id);
    const [result] = await dbConnection.query(query, updateValues);

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found or user not authorized" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Question updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};


module.exports = {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
  editQuestion,
};
