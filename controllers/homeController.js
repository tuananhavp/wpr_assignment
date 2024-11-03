const db = require("../dbsetup");

const home = (req, res) => {
  res.render("home");
};

const verifyCookie = async (req, res, next) => {
  try {
    // Ensure the cookie exists
    if (!req.cookies || !req.cookies.users || !req.cookies.users.id) {
      return res.redirect("/");
    }

    const userId = req.cookies.users.id;
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    // Check if a user is found and if userId matches
    if (rows.length > 0 && rows[0].id === userId) {
      res.status(200);
      next();
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Error in verifyCookie middleware:", error);
    return res.redirect("/");
  }
};

module.exports = { home, verifyCookie };
