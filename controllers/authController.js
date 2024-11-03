const db = require("../dbsetup");

const showSignIn = async (req, res) => {
  try {
    // Ensure the cookie exists
    if (!req.cookies || !req.cookies.users || !req.cookies.users.id) {
      res.render("signIn", { layout: false });
    }

    const userId = req.cookies.users.id;
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    // Check if a user is found and if userId matches
    if (rows.length > 0 && rows[0].id === userId) {
      res.status(200);
      return res.redirect("/home");
    } else {
      res.render("signIn", { layout: false });
    }
  } catch (error) {
    console.error("Error in verifyCookie middleware:", error);
    res.render("signIn", { layout: false });
  }
};

const showSignUp = async (req, res) => {
  try {
    // Ensure the cookie exists
    if (!req.cookies || !req.cookies.users || !req.cookies.users.id) {
      res.render("signUp", { layout: false });
    }

    const userId = req.cookies.users.id;
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    // Check if a user is found and if userId matches
    if (rows.length > 0 && rows[0].id === userId) {
      res.status(200);
      return res.redirect("/home");
    } else {
      res.render("signUp", { layout: false });
    }
  } catch (error) {
    console.error("Error in verifyCookie middleware:", error);
    res.render("signUp", { layout: false });
  }
};

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log(row);
    if (row.length > 0) {
      return res.render("signUp", {
        layout: false,
        error: "This account already exsists!",
      });
    }

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    const [data] = await db.query("SELECT * FROM users");
    res.status(201).redirect("/");
  } catch (error) {
    res.json({ error });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (row.length == 0) {
      return res.render("signIn", {
        layout: false,
        error: "Login failed, please try again",
      });
    }

    const isVerified = password === row[0].password;
    if (isVerified) {
      res.clearCookie();
      res.cookie("users", row[0], {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sign: true,
      });
      res.redirect("home");
    } else {
      return res.render("signIn", {
        layout: false,
        error: "Login failed, please try again",
      });
    }
  } catch (error) {
    res.json({ error });
  }
};

const verifyCookie = async (req, res, next) => {};

module.exports = { showSignIn, signUp, showSignUp, signIn, verifyCookie };
