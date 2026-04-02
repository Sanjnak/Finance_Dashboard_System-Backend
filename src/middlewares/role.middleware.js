const allowRoles = (...roles) => { //here the roles are passed
    return (req, res, next) => {
        if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login first.",
      });
    }
    if(!roles.includes(req.user.role)) { // if the user role comes in the roles provided during calling this middleware then the allowed to perform next action
        return res.status(403).json({
        success: false,
        message: `Access denied. Your role (${req.user.role}) is not allowed to perform this action.`,
      });
      }

    next();
    };
};

module.exports = allowRoles;