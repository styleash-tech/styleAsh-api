const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     //we store in current user in req.user in protect middleware which always run before restrictTO middleware
//     if (!roles.includes(req.user.role)) {
//       // return res.status(403).json({
//       //   //403 means forbidden
//       //   status: "fail",
//       //   message: "you do not have permission to perform this action",
//       // });
//       res.status(401);
//       throw new Error("User not found");
//     }

//     next();
//   };
// };

module.exports = protect;
