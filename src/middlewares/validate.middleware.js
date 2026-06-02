export const validateBody = (schema) => {
  return (req, res, next) => {

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message.replace(/"/g, "'"));
      return res.status(422).json({
        success: false,
        message: 'Datos inválidos.',
        errors: messages,
      });
    }

    req.body = value;
    next();
  };
};
