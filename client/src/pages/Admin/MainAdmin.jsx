import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Title } from "../../components/Title"
import { MainCardLesson } from "../../components/mainCardLesson"
import Comment from "../../components/Comment"
import { get } from "../../hooks/fetchForm"

export const MainAdmin = () => {
    const [cards, setCards] = useState([])
    const [comments, setComments] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        get({ url: 'lessons/all', dispatch, token })
            .then(json => setCards(json.filteredLessons))
        get({ url: 'comments/filter', dispatch, token })
            .then(json => setComments(json.comments))
    }, [token])

    return (
        <>
            <div className="container" key={1}>
                <Title type={2} title={"Занятия"}>
                    <button className="bg-blue-300" onClick={() => navigate(`../newLesson`)}>
                        создать
                    </button>
                </Title>
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
                                            visible={true} />
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="container" key={2}>
                <Title type={1} title={'Модерация отзывов'} />
                {
                    comments?.map((comm) => (
                        <Comment 
                        type={1} 
                        token={token}
                        key={comm.id} 
                        commentId={comm.id} 
                        lessonId={comm.lessonId} 
                        userId={comm.userId} 
                        rating={comm.value} 
                        text={comm.text} 
                        comments={comments} 
                        setComments={setComments} />
                    ))
                }
            </div>
        </>
    )
}