import { Op } from "sequelize";
import models from "../models/models.js";

const Comment = models.Comment

// новый комментарий
export const createComment = async (req, res) => {
    const { userId, lessonId, value, text } = req.body
    try {
        if (!userId || !lessonId || !value || !text) return res.status(400).send({ message: "Все поля должны быть заполнены" })
        const comment = await Comment.create({
            userId, lessonId, statusId: "В обработке", value, text
        })
        return res.send({ message: "Ваш комментарий отправлен на обработку." })
    } catch (error) {
        console.log(error);
        return res.status(404).send({ message: 'Ошибка сервера' })
    }
}

// изменение статуса комментария
export const changeStatus = async (req, res) => {
    const { commentId, statusId } = req.body
    try {
        const comment = await Comment.findOne({
            where: { id: commentId }
        })
        if (!comment) return res.send({ message: "Комментарий не найден" })
        await comment.update({ statusId })
        return res.send({ comment })
    } catch (error) {
        console.log(error);
        return res.status(404).send({ message: 'Ошибка сервера' })
    }
}

// комментарии для занятия
export const allComments = async (req, res) => {
    const { lessonId } = req.params
    const comments = await Comment.findAll({
        where: {
            [Op.and]: [{ lessonId }, { statusId: 'Принят' }]
        }
    })
    return res.send({ comments })
}

// все комментарии одного пользователя
export const userComments = async (req, res) => {
    const { userId } = req.params
    const comments = await Comment.findAll({
        where: { userId }
    })
    return res.send({ comments })
}

// комментарии для фильтра
export const commentsForFilter = async (req, res) => {
    const comments = await Comment.findAll({
        where: { statusId: 'В обработке' }
    })
    return res.send({ comments })
}

// удаление комментария
export const deleteComment = async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findOne({ where: { id: commentId } })
    if (!comment) return res.send({ message: "Комментарий не найден" })
    await comment.destroy()

    return res.send({ comment })
}