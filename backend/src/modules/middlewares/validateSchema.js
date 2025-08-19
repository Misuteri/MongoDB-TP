// middlewares/validateSchema.js: Valide les payloads de requêtes via des schémas Zod
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Validation failed', errors: result.error.flatten() });
    }
    req.body = result.data;
    return next();
  };
}


