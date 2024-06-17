import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { get, post } from "../../hooks/fetchForm"
import { InputComment } from "../../components/inputComment"
import { Title } from "../../components/Title"
import useWindowSize from "../../hooks/windowSize"
import { Carousel } from "../../components/Carousel/Carousel"
import { MainCardLesson } from "../../components/mainCardLesson"
import { Footer } from "../../components/Footer"
import ModelViewer from "../../components/models3D/ModelViewer"

export default function Result() {
    const [lessons, setLessons] = useState([])
    const [username, setUsername] = useState('')
    const [lessonName, setLessonName] = useState('')
    const [lessonType, setLessonType] = useState('')
    const [complete, setComplite] = useState(false)
    const [result, setResult] = useState('')
    const [maxCount, setMaxCount] = useState('')
    const [userRating, setUserRating] = useState('')
    const [textComment, setTextComment] = useState('')
    const [visible, setVisible] = useState(true)
    const model = 3

    const token = useSelector((state) => state.auth.token)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const lessonId = location.pathname.split('/')[2]

    const { width, height } = useWindowSize();
    const numSlides = width > 1024 ? 4 : width > 640 ? 3 : 2
    const rightIndent = height / 4 - 50

    let jwt
    token ? jwt = jwtDecode(token) : null
    const id = jwt?.id

    useEffect(() => {
        get({ url: `users/find/${id}`, dispatch, token })
            .then(json => setUsername(json.user.name));

        get({ url: `lessons/findLesson/${lessonId}`, dispatch, token })
            .then(json => {
                setLessonName(json.lesson.name)
                setLessonType(json.lesson.typeId)

                if (json.lesson.typeId == 'тест') {
                    get({ url: `lessons/result/${lessonId}/${jwt?.id}`, dispatch, token })
                        .then(json => setResult(json.result.result))

                    get({ url: `tests/all/${lessonId}`, dispatch, token })
                        .then(json => setMaxCount(json.questions.length))
                }

                get({ url: `lessons/all`, dispatch, token })
                    .then(data => setLessons(data?.filteredLessons.find(el => el.name == json?.lesson?.categoryId)?.lessons.filter(el => el.id != lessonId)));
            })
    }, [token])

    const handleButtonPostComment = () => {
        post({
            url: `comments/create`, dispatch, token, data: {
                userId: jwt?.id,
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

    console.log(lessons);

    return (
        <>
            <div className="container">
                <Title type={1} title={lessonName} />
                <Title type={4} title={`Поздравляем, ${username}!`} />
                {
                    lessonType == 'тест' &&
                    <h6 className="mb-3">Твой результат: <span className=" text-3xl font-['Aqum_Two']">{result}/{maxCount}</span></h6>
                }
                <h6 className="mb-5">Ты молодец! Надеемся, что тебе всё понравилось!</h6>
                <InputComment
                    setUserRating={setUserRating}
                    textComment={textComment}
                    setTextComment={setTextComment}
                    handleButtonPostComment={handleButtonPostComment}
                    styleButton={"bg-blue-300"}
                    id={jwt?.id}
                    lessonId={lessonId}
                    dispatch={dispatch}
                    token={token}
                    setComplite={setComplite}
                />
                <button className="block bg-white text-black mt-3" onClick={() => navigate('../../../')}>все курсы</button>
            </div>
            {lessons?.length > 0 &&
                <div className="container">
                    <Carousel title={<h2 className="mb-7">Похожие уроки</h2>} summaSlides={lessons?.lessons?.length} numSlides={numSlides}>
                        {
                            lessons?.lessons?.map((lesson, index) => (
                                <div className="grid grid-cols-1 gap-[2%] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" key={index}>
                                    <MainCardLesson
                                        key={lesson.id}
                                        id={lesson.id}
                                        nameLesson={lesson.name}
                                        img={lesson.image}
                                        numStudents={lesson.finish}
                                        numInvite={lesson.invite}
                                        ageUnder={lesson.ageUnder}
                                        ageUp={lesson.ageUp}
                                        visible={false} />
                                </div>
                            ))
                        }
                    </Carousel>
                </div>
            }
            <div className={`clouds ${visible ? 'vis' : 'hid'}`} style={{
                right: `${rightIndent}px`
            }}>
                <div className="cloud">
                    <p style={{ color: 'black' }}>Ты молодец!</p>
                </div>
                <div className="cloud2"></div>
            </div>
            <div className="model">
                <ModelViewer model={model} action={() => setVisible(!visible)} />
            </div>
            <Footer />
        </>
    )
}