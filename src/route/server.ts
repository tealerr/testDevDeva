import express from "express";
import {
  getAllUser,
  deleteUser,
  addUser,
  findUser,
  updateUser,
} from "../services/accounts";

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
  getAllUser(res);
});

app.get("/users/:nameSurname", findUser);

app.post("/users", addUser);

// update user info
app.put("/users/:id", updateUser);

app.delete("/users/:id", deleteUser);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
