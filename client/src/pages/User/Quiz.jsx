import { useEffect, useRef, useState } from "react"
import { get, post } from "../../hooks/fetchForm"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { jwtDecode } from "jwt-decode"
import { Title } from "../../components/Title"
import ModelViewer from "../../components/models3D/ModelViewer"
import { Footer } from "../../components/Footer"
import useWindowSize from "../../hooks/windowSize"

export default function Quiz() {
    const [lessonName, setLessonName] = useState('')
    const [lessonType, setLessonType] = useState('')
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [answer, setAnswer] = useState('')
    const [video, setVideo] = useState(null)
    const [promp, setPromp] = useState('')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [currentPrompCount, setCurrentPrompCount] = useState(0)
    const [visible, setVisible] = useState(false)
    const [model, setModel] = useState(1)
    const [visibleNotice, setVisibleNotice] = useState(false)

    const question = questions[currentQuestionIndex]

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token)
    const location = useLocation()
    const lessonId = location.pathname.split('/')[2]

    const { height } = useWindowSize()
    const rightIndent = height / 4 - 50

    let jwt
    token ? jwt = jwtDecode(token) : null

    useEffect(() => {
        get({ url: `lessons/findLesson/${lessonId}`, dispatch, token })
            .then(json => {
                setLessonName(json.lesson.name)
                setLessonType(json.lesson.typeId)
                if (json.lesson.typeId == 'тест') {
                    get({ url: `tests/all/${lessonId}`, dispatch, token })
                        .then(json => setQuestions(json.questions))
                }
                if (json.lesson.typeId == 'видео-урок') {
                    const fetchVideo = async () => {
                        if (json.lesson.video) {
                            try {
                                const response = await fetch(`http://localhost:8080/${json.lesson.video}`);
                                const videoData = await response.arrayBuffer();
                                const videoBlob = new Blob([videoData], { type: 'video/mp4' })
                                setVideo(videoBlob)
                            }
                            catch (error) {
                                console.error('Failed to fetch video:', error);
                            }
                        }
                    }
                    fetchVideo()
                }
            }
            )
        const timer = setTimeout(() => {
            setModel(4);
            setVisibleNotice(true)
        }, 800)

        const timer2 = setTimeout(() => {
            setModel(1);
            setVisibleNotice(false);
        }, 3200)

        return () => {
            clearTimeout(timer)
            clearTimeout(timer2)
        }
    }, [token])

    const handleAnswer = (ans) => {
        if (!ans) return alert('нужно отметить вариант')
        setAnswer('')
        setAnswers(prev => [...prev, { id: question?.id, answer: ans }])

        if (currentQuestionIndex < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    console.log(answer);

    useEffect(() => {
        if (questions.length >= 1 && currentQuestionIndex == questions.length) {
            post({
                url: `tests/check`, dispatch, token, data: {
                    answers
                }
            })
                .then(json => {
                    post({
                        url: `lessons/createComplite`, dispatch, token, data: {
                            result: json?.correct,
                            promp: currentPrompCount,
                            lessonId,
                            userId: jwt?.id
                        }
                    })
                })

            navigate(`../../../lessons/${lessonId}/finish`)
        }
    }, [answers])

    const handlePromp = (e) => {
        e.preventDefault()

        get({ url: `tests/clue/${question?.id}`, dispatch, token })
            .then(json => {
                setPromp(json.clue);
                setCurrentPrompCount(currentPrompCount + 1);
            })

        const timer = setTimeout(() => {
            setModel(4);
        }, 1800)

        const timer2 = setTimeout(() => {
            setModel(1);
        }, 3500)

        return () => {
            clearTimeout(timer)
            clearTimeout(timer2)
        }
    }

    // отправка результатов для видео-урока
    const handleFinish = () => {
        post({
            url: `lessons/createComplite`, dispatch, token, data: {
                result: null,
                promp: null,
                lessonId,
                userId: jwt?.id
            }
        })
        navigate(`../../../lessons/${lessonId}/finish`)
    }

    const iframeRef = useRef(null);

    useEffect(() => {
        const handleLoad = () => {
            if (iframeRef.current) {
                const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                const videoElement = iframeDocument.querySelector('video');

                if (videoElement) {
                    // Применяем стили к элементу video
                    videoElement.style.width = '100%';
                    videoElement.style.height = 'auto';
                    videoElement.style.margin = '0px';
                    // Добавьте любые другие стили по необходимости
                } else {
                    console.error('Видео элемент не найден внутри iframe.');
                }
            }
        };

        const iframeElement = iframeRef.current;
        if (iframeElement) {
            iframeElement.addEventListener('load', handleLoad);
        }

        return () => {
            if (iframeElement) {
                iframeElement.removeEventListener('load', handleLoad);
            }
        };
    }, [video]);

    if (lessonType == 'видео-урок') return (
        <>
            <div className="container flex flex-col">
                <Title type={1} title={lessonName} />
                <iframe className=" aspect-video" ref={iframeRef} src={video ? URL.createObjectURL(video) : null}></iframe>
                <button className="self-end mb-3 mt-5 bg-blue-300" onClick={handleFinish}>закончить</button>
            </div>
            <div className={`clouds ${visibleNotice || visible ? 'vis' : 'hid'}`} style={{
                right: `${rightIndent}px`
            }}>
                <div className="cloud">
                    <p style={{ color: 'black' }}>Для окончания нажми кнопку "закончить".</p>
                </div>
                <div className="cloud2"></div>
            </div>
            <div className="model">
                <ModelViewer model={model} action={() => setVisible(!visible)} />
            </div>
            <Footer />
        </>
    )

    if (lessonType == 'тест') return (
        <div className="container">
            <div className="flex flex-col " value={answer} onChange={e => setAnswer(e.target.value)}>
                <Title type={1} title={lessonName} />
                <h6 className="mb-2">{`Вопрос ${currentQuestionIndex + 1}`}</h6>
                {
                    question?.image &&
                    <div className="w-full aspect-video lg:w-1/2">
                        <img className="object-cover h-full w-full" src={`http://localhost:8080/${question?.image}`} alt="" />
                    </div>
                }
                <h6 className="mb-3">{question?.question}</h6>
                <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-1">
                        <input type="radio" name={`answer${currentQuestionIndex}`} id={`answer${currentQuestionIndex}v1`} value="v1" />
                        <label htmlFor={`answer${currentQuestionIndex}v1`}>
                            {question?.v1}
                        </label>
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="radio" name={`answer${currentQuestionIndex}`} id={`answer${currentQuestionIndex}v2`} value="v2" />
                        <label htmlFor={`answer${currentQuestionIndex}v2`}>
                            {question?.v2}
                        </label>
                    </div>
                    {
                        question?.v3 &&
                        <div className="flex items-center gap-1">
                            <input type="radio" name={`answer${currentQuestionIndex}`} id={`answer${currentQuestionIndex}v3`} value="v3" />
                            <label htmlFor={`answer${currentQuestionIndex}v3`}>
                                {question?.v3}
                            </label>
                        </div>
                    }
                    {
                        question?.v4 &&
                        <div className="flex items-center gap-1">
                            <input type="radio" name={`answer${currentQuestionIndex}`} id={`answer${currentQuestionIndex}v4`} value="v4" />
                            <label htmlFor={`answer${currentQuestionIndex}v1`}>
                                {question?.v4}
                            </label>
                        </div>
                    }
                </div>
                <button className={`self-end mb-3 ${currentQuestionIndex == questions.length ? `bg-blue-300` : 'bg-white text-black'}`} onClick={() => handleAnswer(answer)}>{currentQuestionIndex + 1 == questions.length ? 'закончить' : 'далее'}</button>
            </div>
            {/* уведомление о возможной помощи */}
            <div className={`clouds ${visibleNotice ? 'vis' : 'hid'}`} style={{
                right: `${rightIndent}px`
            }}>
                <div className="cloud">
                    <p style={{ color: 'black' }}>Нажми на меня, чтобы получить подсказку</p>
                </div>
                <div className="cloud2"></div>
            </div>
            {/* подсказка */}
            <div className={`clouds ${visible ? 'vis' : 'hid'}`} style={{
                right: `${rightIndent}px`
            }}>
                <div className="cloud">
                    <p style={{ color: 'black' }}>{promp}</p>
                </div>
                <div className="cloud2"></div>
            </div>
            <div className="model" onClick={handlePromp}>
                <ModelViewer model={model} action={() => setVisible(!visible)} />
            </div>
            <Footer />
        </div>
    )
}