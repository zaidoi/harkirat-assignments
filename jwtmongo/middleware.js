const { Admin, User } = require("./db.js");

async function adminMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;
  const existingAdmin = await Admin.findOne({
    username: username,
    password: password,
  });
  if (!existingAdmin) {
    return res.status(403).json({
      msg: "First created admin Id",
    });
  } else {
    next();
  }
}

async function userMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;
  const existingAdmin = await User.findOne({
    username: username,
    password: password,
  });
  if (!existingAdmin) {
    return res.status(403).json({
      msg: "User not there",
    });
  } else {
    next();
  }
}



module.exports = { adminMiddleware, userMiddleware };
