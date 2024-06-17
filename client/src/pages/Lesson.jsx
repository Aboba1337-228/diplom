import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Title } from "../components/Title"
import StarRating from "../components/starRating"
import Chart from "../components/Chart"
import { get, post } from "../hooks/fetchForm"
import Comment from "../components/Comment"
import { InputComment } from "../components/inputComment"
import { Footer } from "../components/Footer"
import ModelViewer from "../components/models3D/ModelViewer"
import useWindowSize from "../hooks/windowSize"

export default function Lesson() {
    const [data, setData] = useState('')
    const [comments, setComments] = useState([])
    const [complete, setComplite] = useState(false)
    const [results, setResults] = useState([])
    const [promps, setPromps] = useState([])
    const [textComment, setTextComment] = useState('')
    const [userRating, setUserRating] = useState(0)
    const [visible, setVisible] = useState(false)
    const [model, setModel] = useState(1)

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loc = useLocation()
    const lessonId = loc.pathname.split('/')[2]

    const { height } = useWindowSize()
    const rightIndent = height / 4 - 50

    let jwt
    token ? jwt = jwtDecode(token) : null
    const id = jwt?.id

    useEffect(() => {
        get({ url: `lessons/findLesson/${lessonId}`, dispatch, token })
            .then(json => {
                setData(json.lesson);
                if (jwt.roleId == 'ADMIN' && json.lesson.typeId == 'тест') {
                    get({ url: `lessons/resultsLesson/${lessonId}`, dispatch, token })
                        .then(resultsLesson => {
                            get({ url: `tests/all/${lessonId}`, dispatch, token })
                                .then(tests => {
                                    resultsLesson.lessons.forEach(result => {
                                        const resultMath = (result.result / tests.questions?.length) * 100
                                        setResults(prev => [...prev, { result: resultMath }])

                                        const prompMath = (result.promp / tests.questions?.length) * 100
                                        setPromps(prev => [...prev, { result: prompMath }])
                                    })
                                }
                                )
                        })
                }
            });

        get({ url: `comments/allForLesson/${lessonId}`, dispatch, token })
            .then(json => setComments(json?.comments))

        const timer = setTimeout(() => {
            setModel(4);
            setVisible(true)
        }, 800)

        const timer2 = setTimeout(() => {
            setModel(1);
            setVisible(false);
        }, 3200)

        return () => {
            clearTimeout(timer)
            clearTimeout(timer2)
        }
    }, [])

    let sumRating = 0

    for (let index = 0; index < comments.length; index++) {
        sumRating += Number(comments[index].value)
    }

    const rating = sumRating / comments.length

    const handleButtonPostComment = () => {
        post({
            url: `comments/create`, dispatch, token, data: {
                userId: id,
                lessonId,
                value: userRating,
                text: textComment
            }
        })
            .then(json => {
                alert(json?.message);
                if (json?.message == 'Ваш комментарий отправлен на обработку.') {
                    location.reload()
                }
            })
    }

    return (
        <>
            <div className="container">
                <Title type={6} title={data.name} secondTitle={data.categoryId} position={'md:flex justify-between items-center'}>
                    {
                        jwt.roleId == 'ADMIN' &&
                        <button className="bg-blue-300 mt-2 md:mt-0" onClick={() => navigate(`../../../reductLesson/${lessonId}`)}>изменить</button>
                    }
                </Title>
                <div className="grid grid-cols-1 gap-5 mb-3 lg:grid-cols-2">
                    <div className="w-full rounded-2xl blue aspect-video box-shadow">
                        <img src={`http://localhost:8080/${data.image}`} alt="изображение" />
                    </div>
                    <p>{data.content}</p>
                </div>
                <p className="mb-3">Форма пробного урока: {data.typeId}</p>
                {
                    jwt?.roleId == "USER" &&
                    <div className="flex">
                        <button className="bg-blue-300 ml-auto" onClick={() => navigate(`../../../lessons/${lessonId}/quiz`)}>{complete ? "пройти повторно" : "начать"}</button>
                    </div>
                }
            </div>
            <InputComment
                setUserRating={setUserRating}
                textComment={textComment}
                setTextComment={setTextComment}
                handleButtonPostComment={handleButtonPostComment}
                styleButton={"bg-white text-black"}
                id={id}
                lessonId={lessonId}
                dispatch={dispatch}
                token={token}
                setComplite={setComplite}
            />
            {
                jwt?.roleId == "ADMIN" && data?.typeId == 'тест' &&
                <div className="container">
                    <Title type={3} title={'Статистика по вопросам'} />
                    <div className="grid grid-cols-1 gap-5 mb-3 lg:grid-cols-2">
                        <div className="blue box-shadow rounded-2xl p-4" >
                            <Title type={5} title={'Правильность ответов'} />
                            <Chart array={results} max={100} x={'Ученики'} y={'Проценты'} />
                        </div>
                        <div className="blue box-shadow rounded-2xl p-4" >
                            <Title type={5} title={'Использование подсказок'} />
                            <Chart array={promps} max={100} x={'Ученики'} y={'Проценты'} />
                        </div>
                    </div>
                </div>
            }
            <div className="container">
                <Title type={3} title={'Отзывы'} position={'flex items-end gap-4'} >
                    <p>({comments.length})</p>
                    <StarRating rating={rating} />
                </Title>
                <div className="flex flex-col gap-4">
                    {
                        jwt?.roleId == 'ADMIN'
                            ?
                            comments.map((comm) => (
                                <Comment type={3} key={comm.id} token={token} dispatch={dispatch} lessonId={lessonId} userId={comm.userId} rating={comm.value} text={comm.text} />
                            ))
                            :
                            comments.map((comm) => (
                                <Comment type={2} key={comm.id} token={token} dispatch={dispatch} lessonId={lessonId} userId={comm.userId} rating={comm.value} text={comm.text} />
                            ))
                    }
                </div>
            </div>
            {
                jwt?.roleId == "USER" &&
                <>
                    <div className={`clouds ${visible ? 'vis' : 'hid'}`} style={{
                        right: `${rightIndent}px`
                    }}>
                        <div className="cloud">
                            <p style={{ color: 'black' }}>Если во время занятия тебе понадобится подсказка - кликни на меня.</p>
                        </div>
                        <div className="cloud2"></div>
                    </div>
                    <div className="model">
                        <ModelViewer model={model} action={() => setVisible(!visible)} />
                    </div>
                    <Footer />
                </>
            }
        </>
    )
}