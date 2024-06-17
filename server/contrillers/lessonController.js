import { Op, where } from "sequelize";
import models from "../models/models.js";

const Lesson = models.Lesson
const Question = models.Question
const LessonComplited = models.LessonComplited
const Category = models.Category
const Type = models.Type

// все занятия по категориям
export const allLessons = async (req, res) => {
    try {
        const categories = await Category.findAll()
        let filteredLessons = []
        for (let index = 0; index < categories.length; index++) {
            const lessons = await Lesson.findAll({ where: { categoryId: categories[index].id } });
            filteredLessons.push({ name: [categories[index].id], lessons });
        }
        return res.send({ filteredLessons })
    } catch (error) {
        console.error('Error fetching lessons:', error)
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}

// категории
export const categories = async (req, res) => {
    const categories = await Category.findAll()
    return res.send({ categories })
}

// типы уроков
export const types = async (req, res) => {
    const types = await Type.findAll()
    return res.send({ types })
}

// создать занятие
export const createLesson = async (req, res) => {
    const { name, content, ageUnder, ageUp, typeId, categoryId } = req.body
    console.log(req.files, name, content, ageUnder, ageUp, typeId, categoryId);
    const image = req.files['image'] ? req.files['image'][0].filename : null
    const video = req.files['video'] ? req.files['video'][0].filename : null

    if (!name || !ageUnder || !ageUp || !typeId || !categoryId) return res.send({ message: "Все поля должны быть заполнены" })
    const lesson = await Lesson.create({
        name, content, video, ageUnder, ageUp, image, invite: '0', typeId, categoryId
    })
    return res.send({ lesson })
}

// изменить занятие
export const changeLesson = async (req, res) => {
    const { id, name, content, ageUnder, ageUp, invite, typeId, categoryId } = req.body;

    const image = req.files['image'] ? req.files['image'][0].filename : null
    const video = req.files['video'] ? req.files['video'][0].filename : null

    if (!id) return res.send({ message: "ID урока обязателен для обновления" });

    const updateData = {};
    if (name) updateData.name = name;
    if (content) updateData.content = content;
    if (video) updateData.video = video;
    if (ageUnder) updateData.ageUnder = ageUnder;
    if (ageUp) updateData.ageUp = ageUp;
    if (image) updateData.image = image;
    if (invite) updateData.invite = invite;
    if (typeId) updateData.typeId = typeId;
    if (categoryId) updateData.categoryId = categoryId;

    const lesson = await Lesson.findOne({ where: { id } });
    if (!lesson) return res.send({ message: "Занятие не найдено" });

    await lesson.update(updateData);
    return res.send({ lesson });
}

// создать пройденное занятие с результатами
export const createLC = async (req, res) => {
    const { result, promp, lessonId, userId } = req.body;

    const unique = await LessonComplited.findOne({
        where: { lessonId, userId }
    });

    if (unique) {
        const updateResult = await unique.update({
            result
        });

        return res.send({ updateResult });
    } else {
        const LC = await LessonComplited.create({
            result, promp, lessonId, userId
        });

        const lesson = await Lesson.findOne({
            where: { id: lessonId }
        });

        if (lesson) {
            const updatedFinish = await lesson.update({
                finish: lesson.finish + 1
            }, {
                where: { id: lessonId }
            });
        }

        return res.send({ LC });
    }
};


// все оконченные занятия определенного пользователя
export const allCompliteUser = async (req, res) => {
    const { userId } = req.params

    const lessons = await LessonComplited.findAll({
        where: { userId },
    })

    return res.send({ lessons })
}

// все записи по определенному оконченному занятию
export const resultsLesson = async (req, res) => {
    const { lessonId } = req.params
    const lessons = await LessonComplited.findAll({ where: { lessonId } })
    return res.send({ lessons })
}

// результат пользователя по оконченному занятию
export const resultLesson = async (req, res) => {
    const { lessonId, userId } = req.params
    const result = await LessonComplited.findOne({ where: { lessonId, userId } })
    return res.send({ result })
}

// найти урок
export const findLesson = async (req, res) => {
    const { lessonId } = req.params
    try {
        if (!lessonId) return res.status(400).send({ message: 'Должен быть ид урока' })
        const lesson = await Lesson.findOne({ where: { id: lessonId } })
        return res.send({ lesson })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Ошибка сервера' })
    }
}

// удалить занятие
export const deleteLesson = async (req, res) => {
    const { lessonId } = req.params

    const lesson = await Lesson.findOne({ where: { id: lessonId } })
    if (!lesson) return res.send({ message: "Занятие не найдено" })
    const LC = await LessonComplited.destroy({ where: { lessonId } })
    const questions = await Question.destroy({ where: { lessonId } })
    await lesson.destroy()

    return res.send({ lesson, LC })
}