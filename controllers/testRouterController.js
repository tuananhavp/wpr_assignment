const pool = require("../dbsetup");

const testRouterController = (req, res) => {
  console.log(db);
  res.send(db);
};

async function testAPI(req, res) {
  const data = await pool.query("SELECT * FROM emails");
  res.send(data[0]);
}

module.exports = { testRouterController, testAPI };
