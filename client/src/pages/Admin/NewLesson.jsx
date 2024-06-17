import { useEffect, useState } from "react"
import { Title } from "../../components/Title"
import { get } from "../../hooks/fetchForm"
import { useDispatch, useSelector } from "react-redux"
import { InputFile } from "../../components/inputFile"
import { useNavigate } from "react-router-dom"

function NewLesson() {
    const [categories, setCategories] = useState([])
    const [types, setTypes] = useState([])
    const [dataList, setDataList] = useState([])
    const [nameLesson, setNameLesson] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [ageUnder, setAgeUnder] = useState('')
    const [ageUp, setAgeUp] = useState('')
    const [image, setImage] = useState(null)
    const [video, setVideo] = useState(null)
    const [lessonType, setLessonType] = useState('тест')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const token = useSelector(state => state.auth.token)

    useEffect(() => {
        get({ url: `lessons/categories`, dispatch, token })
            .then(json => {
                setCategories(json.categories);
                setCategory(json.categories[0].id)
            })
        get({ url: `lessons/types`, dispatch, token })
            .then(json => setTypes(json.types))
    }, [token])

    const handleClick = (id) => {
        document.getElementById(id).click()
    }

    const handleClickDelete = (index) => {
        setDataList(prev => prev.filter((item, i) => i != index))
    }

    const handleAddClick = () => {
        setDataList(prev => [...prev, { question: '', v1: '', v2: '', v3: '', v4: '', correct: '', clue: '', image: null }])
    }

    const handleChangeData = (e, index, field) => {
        const { value } = e.target
        setDataList(prev =>
            prev.map((item, ix) => ix == index ? { ...item, [field]: value } : item)
        )
    }

    const handleChangeDataFile = (index, field, e) => {
        console.log(e);
        const file = e.target.files[0]
        file ? setDataList(prev =>
            prev.map((item, ix) => ix == index ? { ...item, [field]: file } : item)
        ) : setDataList(prev =>
            prev.map((item, ix) => ix == index ? { ...item, [field]: null } : item)
        )
    }

    const handleChangeSelect = (e, index) => {
        const { value } = e.target
        setDataList(prev =>
            prev.map((item, ix) => ix == index ? { ...item, correct: value } : item)
        )
    }

    const handleClickPost = async (e) => {
        e.preventDefault()

        const formdata = new FormData()

        formdata.append('name', nameLesson)
        formdata.append('content', content)
        formdata.append('ageUnder', ageUnder)
        formdata.append('ageUp', ageUp)
        formdata.append('image', image)
        formdata.append('typeId', lessonType)
        formdata.append('categoryId', category)
        if (lessonType == 'видео-урок') formdata.append('video', video)

        const response = await fetch('http://localhost:8080/api/lessons/create', {
            method: "POST",
            body: formdata
        }).then(data => data.json())

        const formArray = new FormData()
        console.log(response);

        if (lessonType == 'тест') {
            formArray.append('lessonId', response.lesson.id)
            dataList.forEach((question, index) => {
                formArray.append(`questions[${index}][image]`, question.image);
                formArray.append(`questions[${index}][question]`, question.question);
                formArray.append(`questions[${index}][v1]`, question.v1);
                formArray.append(`questions[${index}][v2]`, question.v2);
                formArray.append(`questions[${index}][v3]`, question.v3);
                formArray.append(`questions[${index}][v4]`, question.v4);
                formArray.append(`questions[${index}][correct]`, question.correct);
                formArray.append(`questions[${index}][clue]`, question.clue);
            })

            const response2 = await fetch('http://localhost:8080/api/tests/create', {
                method: "POST",
                body: formArray
            }).then(data => data.json())

            console.log(response2);
        }

        alert('занятие успешно создано')
        navigate(`../../lessons/${response.lesson.id}`)
    }

    console.log(dataList);

    return (
        <>
            <div className="container">
                <Title type={1} title={'Создание занятия'} />
                <input type="text" placeholder="Название" value={nameLesson} onChange={e => setNameLesson(e.target.value)} />
                <textarea name="" id="" cols="30" rows="10" placeholder="Описание" value={content} onChange={e => setContent(e.target.value)} />
                <select value={category} onChange={e => setCategory(e.target.value)} name="" id="">
                    {
                        categories.map(category => (
                            <option value={category.id} key={category.id}>{category.id}</option>
                        ))
                    }
                </select>
                <div className="flex gap-5">
                    <input type="text" value={ageUnder} onChange={e => setAgeUnder(e.target.value)} placeholder="Возраст от" style={{ width: '175px' }} />
                    <input type="text" value={ageUp} onChange={e => setAgeUp(e.target.value)} placeholder="Возраст до" style={{ width: '175px' }} />
                </div>
                <InputFile file={image} setFile={setImage} handleClick={handleClick} idInput={'imageInput'} />
            </div>
            <div className="container">
                <p>Обратите внимание, что можно выбрать только один тип занятия</p>
                <div className="flex gap-5 mt-3">
                    {
                        types.map((type) => (
                            <Title type={4} key={type.id} title={type.id} onClick={() => setLessonType(type.id)} position={lessonType == type.id ? '' : 'text-gray-400'} />
                        ))
                    }
                </div>
                <div className="flex flex-col gap-5">
                    {
                        lessonType == 'тест' &&
                        <>
                            <p>Выберите правильный ответ на вопрос</p>
                            {
                                dataList.map((q, index) => (
                                    <div className="blue box-shadow rounded-3xl p-7" key={index + 1}>
                                        <div className="flex justify-between items-start mb-1">
                                            <Title type={5} title={`Вопрос ${index + 1}`} />
                                            <button className=" bg-red-400" onClick={() => handleClickDelete(index)}>удалить</button>
                                        </div>
                                        <textarea name="question" value={q.question} onChange={e => handleChangeData(e, index, `question`)} placeholder="Вопрос"></textarea>
                                        {
                                            [...Array(4)].map((item, i) => (
                                                <div className="flex items-center gap-1 mb-5" key={i}>
                                                    <input
                                                        type="radio"
                                                        name={`answer${index}`}
                                                        id={`answer${index}v${i + 1}`}
                                                        value={`v${i + 1}`}
                                                        onChange={e => handleChangeSelect(e, index)}
                                                    />
                                                    <label htmlFor={`answer${index}v${i + 1}`}>
                                                        <input
                                                            type="text" value={q[`v${i + 1}`]}
                                                            onChange={e => handleChangeData(e, index, `v${i + 1}`)}
                                                            style={{ marginBottom: "0" }}
                                                            placeholder="Вариант ответа"
                                                        />
                                                    </label>
                                                </div>
                                            ))
                                        }
                                        <textarea
                                            name="clue"
                                            placeholder="Подсказка"
                                            value={q.clue}
                                            onChange={e => handleChangeData(e, index, `clue`)}></textarea>
                                        <input id={`fileInput${index}`} type="file" onChange={e => handleChangeDataFile(index, `image`, e)} />
                                        <label htmlFor={`fileInput${index}`} className="flex gap-5 items-start">
                                            <div className="bg-white text-blue-950 py-4 px-5 rounded-3xl w-full sm:w-[370px]">{q.image ? q.image.name : 'Изображение к вопросу'}</div>
                                            <button className="bg-white text-black " onClick={() => handleClick(`fileInput${index}`)}>выбрать файл</button>
                                        </label>
                                    </div>
                                ))
                            }
                            <button className="blue box-shadow" onClick={handleAddClick}>+</button>
                        </>
                    }
                    {
                        lessonType == 'видео-урок' &&
                        <div className="mt-5 mb-5">
                            <InputFile file={video} setFile={setVideo} handleClick={handleClick} idInput={'videoInput'} />
                        </div>
                    }
                    <button className="bg-blue-300 self-start" onClick={handleClickPost}>создать</button>
                </div>
            </div>
        </>
    )
}

export default NewLesson