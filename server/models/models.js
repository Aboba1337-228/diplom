import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    surname: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.DATEONLY, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

const Question = sequelize.define('question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING },
    v1: { type: DataTypes.STRING, allowNull: false },
    v2: { type: DataTypes.STRING, allowNull: false },
    v3: { type: DataTypes.STRING },
    v4: { type: DataTypes.STRING },
    correct: { type: DataTypes.STRING },
    clue: { type: DataTypes.TEXT },
});

const Lesson = sequelize.define('lesson', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    video: { type: DataTypes.STRING },
    ageUnder: { type: DataTypes.INTEGER },
    ageUp: { type: DataTypes.INTEGER },
    image: { type: DataTypes.STRING },
    finish: { type: DataTypes.INTEGER },
    invite: { type: DataTypes.INTEGER },
});

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
});

const Status = sequelize.define('status', {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
});

const Category = sequelize.define('category', {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
});

const Role = sequelize.define('role', {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
});

const LessonComplited = sequelize.define('lessonComplited', {
    result: { type: DataTypes.INTEGER },
    promp: { type: DataTypes.INTEGER },
});

User.hasMany(Comment)
Comment.belongsTo(User)

Lesson.hasMany(Comment)
Comment.belongsTo(Lesson)

Status.hasMany(Comment)
Comment.belongsTo(Status)

Type.hasMany(Lesson)
Lesson.belongsTo(Type)

Category.hasMany(Lesson)
Lesson.belongsTo(Category)

Lesson.hasMany(Question)
Question.belongsTo(Lesson)

Role.hasMany(User)
User.belongsTo(Role)

User.belongsToMany(Lesson, { through: LessonComplited })
Lesson.belongsToMany(User, { through: LessonComplited })

export default {
    User,
    Question,
    Lesson,
    Comment,
    Status,
    Type,
    Category,
    Role,
    LessonComplited
}