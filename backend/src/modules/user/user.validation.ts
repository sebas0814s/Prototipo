import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email muy largo'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('La contraseña debe tener entre 8 y 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener mayúsculas, minúsculas y números'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nombre requerido (máx. 100 caracteres)')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Apellido requerido (máx. 100 caracteres)')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]{7,20}$/)
    .withMessage('Teléfono inválido'),
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Contraseña requerida'),
];

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nombre inválido (máx. 100 caracteres)')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Apellido inválido (máx. 100 caracteres)')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]{7,20}$/)
    .withMessage('Teléfono inválido'),
];
