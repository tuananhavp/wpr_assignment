const { json } = require("express");
const db = require("../dbsetup");

const home = async (req, res) => {
  try {
    const user = req.cookies.users;
    const page = parseInt(req.query.page) || 1;
    const emailsPerPage = 5;
    const offset = (page - 1) * emailsPerPage;

    const [rows] = await db.query(
      `SELECT emails.*, sender.name AS sender_name, receiver.name AS receiver_name
         FROM emails
         JOIN users AS sender ON emails.sender_id = sender.id
         JOIN users AS receiver ON emails.receiver_id = receiver.id
         WHERE emails.receiver_id = ? 
         LIMIT ? OFFSET ?`,
      [user.id, emailsPerPage, offset]
    );
    const [users] = await db.query("SELECT * FROM users WHERE id != ?", [
      user.id,
    ]);

    const [userNameResult] = await db.query(
      "SELECT name FROM users WHERE id = ?",
      [user.id]
    );
    const userName = userNameResult[0].name;
    // console.log(rows);
    const [totalEmails] = await db.query(
      "SELECT COUNT(*) as count FROM emails WHERE receiver_id = ?",
      [user.id]
    );

    const totalPages = Math.ceil(totalEmails[0].count / emailsPerPage);

    return res.render("home", {
      users,
      row: rows,
      currentPage: page,
      totalPages: totalPages,
      userName,
    });
  } catch (error) {
    console.error("Error in home function:", error);
    return res.redirect("/");
  }
};

const createEmail = async (req, res) => {
  const { email, title, content } = req.body;
  try {
    const senderId = req.cookies.users.id;
    // Verify the email input
    const [isMatch] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (isMatch && isMatch[0].id != senderId) {
      // Insert new emails for user
      await db.query(
        "INSERT INTO emails (sender_id, receiver_id, subject, body) VALUES (?, ?, ?, ?) ",
        [senderId, isMatch[0].id, title, content]
      );
      return res.redirect("/");
    }
    return res.redirect("/");
  } catch (error) {
    return res.json({ message: "Can not create emails" });
  }

  //   return res.json({ email, title, content });
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

const getDetail = async (req, res) => {
  try {
    emailId = req.params.id;
    const [post] = await db.query(
      `SELECT emails.*, sender.name AS sender_name, sender.email AS sender_email, receiver.name AS receiver_name, receiver.email AS receiver_email FROM emails 
      JOIN users AS sender ON emails.sender_id = sender.id 
      JOIN users AS receiver ON emails.receiver_id = receiver.id 
      WHERE emails.id = ? `,
      [emailId]
    );
    const data = post[0];
    return res.render("detail", {
      data,
    });
  } catch (error) {
    return res.redirect("/");
  }
};

const deleteEmail = async (req, res) => {
  try {
    const emailIds = req.body.emailIds;
    // console.log(emailIds);
    if (!emailIds) {
      return res.redirect("/home");
    }

    // Convert emailIds to an array if it's a single value
    const emailIdsArray = Array.isArray(emailIds) ? emailIds : [emailIds];
    // console.log(emailIdsArray);

    // Delete the selected emails
    await db.query("DELETE FROM emails WHERE id IN (?)", [emailIdsArray]);
    res.redirect("/home");
  } catch (error) {
    // console.error("Error deleting emails:", error);
    res.redirect("/");
  }
};

const deleteEmailById = async (req, res) => {
  try {
    emailId = req.params.id;
    await db.query("DELETE FROM emails WHERE id IN (?)", [emailId]);
    const data = post[0];
    res.redirect("/home");
  } catch (error) {
    return res.redirect("/");
  }
};

const outbox = async (req, res) => {
  const userId = req.cookies.users.id;
  const page = parseInt(req.query.page) || 1;
  const emailsPerPage = 5;
  const offset = (page - 1) * emailsPerPage;
  try {
    const [rows] = await db.query(
      `SELECT emails.*, receiver.name AS receiver_name, receiver.email AS receiver_email
       FROM emails
       JOIN users AS receiver ON emails.receiver_id = receiver.id
       WHERE emails.sender_id = ?
       LIMIT ? OFFSET ?`,
      [userId, emailsPerPage, offset]
    );
    const [users] = await db.query("SELECT * FROM users WHERE id != ?", [
      userId,
    ]);

    const [totalEmails] = await db.query(
      "SELECT COUNT(*) as count FROM emails WHERE sender_id = ?",
      [userId]
    );

    // Fetch the user's name
    const [userNameResult] = await db.query(
      "SELECT name FROM users WHERE id = ?",
      [userId]
    );
    const userName = userNameResult[0].name;
    const totalPages = Math.ceil(totalEmails[0].count / emailsPerPage);

    res.render("outbox", {
      users,
      row: rows,
      currentPage: page,
      totalPages: totalPages,
      userName,
    });
  } catch (error) {
    console.error("Error in home function:", error);
    // res.redirect("/");
  }
};
module.exports = {
  home,
  verifyCookie,
  createEmail,
  getDetail,
  deleteEmail,
  deleteEmailById,
  outbox,
};
