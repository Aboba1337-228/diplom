import { useEffect, useState } from "react"
import { get } from "../../hooks/fetchForm"
import { useDispatch, useSelector } from "react-redux"
import { Title } from "../../components/Title"
import { MainCardLesson } from "../../components/mainCardLesson"
import ModelViewer from "../../components/models3D/ModelViewer"
import { sayHi } from "../../redux/authSlice"
import { Footer } from "../../components/Footer"
import useWindowSize from "../../hooks/windowSize"

export default function MainUser() {
    const [cards, setCards] = useState([])
    const [visible, setVisible] = useState(false)
    const [model, setModel] = useState(1)

    const dispatch = useDispatch()

    const token = useSelector(state => state.auth.token)
    const isSayHi = useSelector(state => state.auth.isSayHi)

    const { height } = useWindowSize()
    const rightIndent = height / 4 - 50

    useEffect(() => {
        get({ url: 'lessons/all', dispatch, token })
            .then(json => setCards(json.filteredLessons))

        if (isSayHi !== 'false') {
            const timer = setTimeout(() => {
                setModel(2);
                setVisible(true)
            }, 500)

            const timer2 = setTimeout(() => {
                setModel(1);
                setVisible(false);
                dispatch(sayHi())
            }, 2800)

            return () => {
                clearTimeout(timer)
                clearTimeout(timer2)
            }
        }
    }, [])

    return (
        <>
            <div className="container">
                <Title type={1} title={"Занятия"} />
                {
                    cards?.map((category, index) => (
                        <div className="" key={index}>
                            <Title type={3} position={'mt-5'} title={category.name} />
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" key={category.id}>
                                {
                                    category?.lessons.map(card => (
                                        <MainCardLesson
                                            key={card.id}
                                            id={card.id}
                                            nameLesson={card.name}
                                            img={card.image}
                                            numStudents={card.finish}
                                            numInvite={card.invite}
                                            ageUnder={card.ageUnder}
                                            ageUp={card.ageUp}
                                            visible={false} />
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
                {/* Моделька */}
                <div className={`clouds ${visible ? 'vis' : 'hid'}`} style={{
                right: `${rightIndent}px`
            }}>
                    <div className="cloud">
                        <p style={{ color: 'black' }}>Привет! Выбери понравившееся занятие.</p>
                    </div>
                    <div className="cloud2"></div>
                </div>
                <div className="model">
                    <ModelViewer model={model} action={() => setVisible(!visible)} />
                </div>
            </div>
            <Footer />
        </>
    )
}