export const validateData = (schema) => {
  return async (req, res, next) => {

    let errorResult = [];
    for (const key of Object.keys(schema)) {

      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        errorResult.push(error.message);
      }
    }
    if (errorResult.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: errorResult });
    }
    next();
  };
};