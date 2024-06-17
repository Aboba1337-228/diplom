import { } from "express-validator";

export const RegistrationMW = (email, password) => {
    return [
        email.isEmail().withMessage('Некорректный адрес электронной почты'),
        password.isLength({ min: 8 }).withMessage('Пароль должен содержать 8 и более символов'),
    ]
}