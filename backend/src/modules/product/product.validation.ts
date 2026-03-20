import { body, param } from 'express-validator';

export const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Nombre requerido (máx. 255 caracteres)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Descripción muy larga (máx. 2000 caracteres)'),
  body('price')
    .isFloat({ min: 0, max: 999999999 })
    .withMessage('Precio inválido'),
  body('material')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Material muy largo (máx. 100 caracteres)'),
  body('dimensions')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Dimensiones muy largas (máx. 100 caracteres)'),
  body('stock')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Stock inválido'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('ID de categoría inválido'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL de imagen inválida'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notas muy largas (máx. 500 caracteres)'),
];

export const updateProductValidation = [
  param('id').isUUID().withMessage('ID de producto inválido'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Nombre inválido (máx. 255 caracteres)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Descripción muy larga (máx. 2000 caracteres)'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999999 })
    .withMessage('Precio inválido'),
  body('material')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Material muy largo (máx. 100 caracteres)'),
  body('dimensions')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Dimensiones muy largas (máx. 100 caracteres)'),
  body('stock')
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage('Stock inválido'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('ID de categoría inválido'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL de imagen inválida'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notas muy largas (máx. 500 caracteres)'),
];

export const productIdValidation = [
  param('id').isUUID().withMessage('ID de producto inválido'),
];
