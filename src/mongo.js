const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });

const logInSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LogInCollection = mongoose.model("users", logInSchema);

const codingSessionSchema = new mongoose.Schema({
  sessionCode: { type: String, required: true, unique: true },
  sessionName: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const CodingSessionCollection = mongoose.model(
  "CodingSession",
  codingSessionSchema
);

module.exports = {
  LogInCollection,
  CodingSessionCollection,
};
