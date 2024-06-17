import models from "../models/models.js";

const Question = models.Question

// создание теста
export const createTest = async (req, res) => {
    const { lessonId } = req.body;
    const questions = req.body.questions; // Теперь это массив объектов вопросов

    if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Нет входящего массива с вопросами" });
    }

    try {
        for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];

            const question = await Question.create({
                question: questionData.question,
                v1: questionData.v1,
                v2: questionData.v2,
                v3: questionData.v3 || null,
                v4: questionData.v4 || null,
                correct: questionData.correct,
                clue: questionData.clue,
                image: req.files[i].filename || null,
                lessonId
            });
        }

        return res.status(200).json({ message: "Вопросы успешно созданы" });
    } catch (error) {
        console.error("Ошибка при создании вопросов:", error);
        return res.status(500).json({ message: "Произошла ошибка при создании вопросов" });
    }
};

// обновление вопросов теста
export const updateTest = async (req, res) => {
    const { lessonId } = req.body;
    const questions = req.body.questions; // Теперь это массив объектов вопросов
    console.log(req.body);
    if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: "Нет входящего массива с вопросами" });
    }

    try {
        for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];

            const filteredFiles = req.files.filter(fileName => {
                // Разбиваем имя файла по символу "["
                console.log('fileName', fileName);
                const parts = fileName?.filename?.split('[');
                if (parts?.length > 1) {
                    // Получаем последнюю часть, которая содержит индекс и символ "]"
                    const indexPart = parts[1];
                    // Извлекаем индекс, удаляя символ "]"
                    const index = parseInt(indexPart.substring(0, indexPart.indexOf(']')));
                    console.log('index', index);
                    // Сравниваем с индексом для фильтрации
                    return index === i;
                }
                return false;
            });

            console.log('filteredFiles', filteredFiles); // Вернет массив файлов с индексом 1

            if (questionData.id && filteredFiles[0]?.filename) {
                const questionUpdate = await Question.update(
                    {
                        index: questionData.index,
                        question: questionData.question,
                        v1: questionData.v1,
                        v2: questionData.v2,
                        v3: questionData?.v3,
                        v4: questionData?.v4,
                        correct: questionData.correct,
                        clue: questionData.clue,
                        image: filteredFiles[0]?.filename,
                        lessonId
                    }, {
                    where: { id: questionData.id }
                })
            } if (questionData.id && !filteredFiles[0]?.filename) {
                const questionUpdate = await Question.update(
                    {
                        index: questionData.index,
                        question: questionData.question,
                        v1: questionData.v1,
                        v2: questionData.v2,
                        v3: questionData?.v3,
                        v4: questionData?.v4,
                        correct: questionData.correct,
                        clue: questionData.clue,
                        lessonId
                    }, {
                    where: { id: questionData.id }
                })
            }
            if (!questionData.id) {
                const question = await Question.create({
                    index: questionData.index,
                    question: questionData.question,
                    v1: questionData.v1,
                    v2: questionData.v2,
                    v3: questionData?.v3,
                    v4: questionData?.v4,
                    correct: questionData.correct,
                    clue: questionData.clue,
                    image: filteredFiles[0]?.filename,
                    lessonId
                });
            }
        }

        return res.status(200).json({ message: "Вопросы успешно изменены" });
    } catch (error) {
        console.error("Ошибка при изменении вопросов:", error);
        return res.status(500).json({ message: "Произошла ошибка при изменении вопросов" });
    }
};

// все вопросы теста
export const allQuestions = async (req, res) => {
    const { lessonId } = req.params

    const questions = await Question.findAll({
        where: { lessonId },
        attributes: ['id', 'question', 'v1', 'v2', 'v3', 'v4', 'image']
    })

    return res.send({ questions })
}

// все вопросы теста вместе с ответами
export const allQuestionsForUpdate = async (req, res) => {
    const { lessonId } = req.params

    const questions = await Question.findAll({
        where: { lessonId }
    })

    return res.send({ questions })
}


// подсказка на вопрос по его ид
export const clueForQuestion = async (req, res) => {
    const { id } = req.params

    const clue = await Question.findOne({
        where: { id },
        attributes: ['clue']
    })

    console.log(clue);

    return res.send({ clue: clue.clue })
}

// проверка правильности ответов
export const checkAnswer = async (req, res) => {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers?.length < 1) {
        return res.status(400).json({ message: "Нет входящего массива с ответами или он пустой" });
    }

    let correct = 0

    try {
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            const check = await Question.findOne({
                where: { id: answer.id }
            });
            if (answer.answer == check.correct) {
                correct += 1
            }
        }

        return res.status(200).json({ correct });
    } catch (error) {
        console.error("Ошибка при проверке ответов:", error);
        return res.status(500).json({ message: "Произошла ошибка при проверке ответов" });
    }
};