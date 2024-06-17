import bcrypt from "bcrypt"
import models from "../models/models.js"
import { generateAccessToken } from "../generateToken/generateToken.js"
import { validationResult } from "express-validator"
import { Op } from "sequelize"

const User = models.User

// создание пользователя
export const reg = async (req, res) => {
    const { surname, name, birthday, email, password } = req.body

    if (!surname || !name || !birthday || !email || !password) return res.send({ message: 'Не все поля заполнены' })

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    let user = await User.findOne({ where: { email } })

    if (user) return res.send({ message: 'Адрес эл. почты уже используется' })


    const hashPassword = bcrypt.hashSync(password, 10)

    user = await User.create({ surname, name, birthday, email, password: hashPassword, roleId: 'USER' })

    return res.send({ message: 'Пользователь успешно зарегистрирован.' })
}

// вход
export const auth = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).send({ message: 'Не все поля заполнены' })

    const user = await User.findOne({ where: { email } })

    if (!user) return res.send({ message: 'Адрес эл. почты не найден' })

    const isValidPassword = bcrypt.compareSync(password, user.password)

    if (!isValidPassword) return res.send({ message: 'Неверный пароль' })

    const token = generateAccessToken(user.id, user.roleId)

    return res.send({ user, token })
}

// найти пользователя 
export const findUserById = async (req, res) => {
    const { userId } = req.params
    const user = await User.findOne({ where: { id: userId } })
    if (!user) return res.send({ message: "Пользователь не найден" })
    return res.send({ user })
}

// все пользователи
export const allUsers = async (req, res) => {
    const users = await User.findAll()
    return res.send({ users })
}

// изменение пользователя
export const changeUser = async (req, res) => {
    const { id, surname, name, email } = req.body

    if (!id || !surname || !name || !email) return res.send({ message: "Все поля должны быть заполнены" })

    const user = await User.findOne({ where: { id } })

    if (!user) return res.send({ message: "Пользователь не найден" })

    const uniqueEmail = await User.findOne({
        where: {
            email,
            id: { [Op.ne]: id }
        }
    })

    if (!uniqueEmail) {
        await user.update({ surname, name, email })

        return res.send({ message: "Данные успешно обновлены" })
    } else {
        return res.send({ message: "Данная электронная почта уже занята" })
    }
}

// смена пароля
export const changePassword = async (req, res) => {
    const { id, prevPassword, newPassword } = req.body

    if (!prevPassword || !newPassword) return res.send({ message: "Не все поля заполнены" })

    const user = await User.findOne({ where: { id } })

    if (!user) return res.send({ message: 'Пользователь не найден' })

    const isValidPassword = bcrypt.compareSync(prevPassword, user.password)

    if (!isValidPassword) return res.send({ message: 'Неверный пароль' })

    const changePassword = bcrypt.hashSync(newPassword, 10)

    const updateUser = await user.update({ password: changePassword })

    return res.send({ message: 'Пароль обновлен' })
}

// удаление пользователя
export const deleteUser = async (req, res) => {
    const { userId } = req.params
    const user = await User.findOne({ where: { id: userId } })
    if (!user) return res.send({ message: "Пользователь не найден" })
    await user.destroy()
    return res.send({ message: 'Пользователь удален' })
}