const express = require("express");

// REST object
const app = express();
// PORT
const PORT = 3356;
// Routes
app.get("/", (req, res) => {
  res.send(" Word!!!");
});

app.listen(PORT, () => {
  console.log("You are succesfully open the sever!!!!");
});
