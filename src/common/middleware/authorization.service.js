export const authorization = (roles = []) => {
  return async (req, res, next) => {
      const user = req.user;
      if (!roles.includes(user.role)) {
        throw new Error("Unauthorized", { cause: 401 });
      }
      next();
  };
};