exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //we store in current user in req.user in protect middleware which always run before restrictTO middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        //403 means forbidden
        status: "fail",
        message: "you do not have permission to perform this action",
      });
    }

    next();
  };
};
