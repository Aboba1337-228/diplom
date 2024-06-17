import { useEffect, useState } from "react"
import { Title } from "./Title"
import HandleRating from "./handleRating"
import { get } from "../hooks/fetchForm"

export const InputComment = ({
    setUserRating,
    textComment,
    setTextComment,
    handleButtonPostComment,
    styleButton,
    id,
    lessonId,
    dispatch,
    token,
    setComplite
}) => {
    const [compl, setCompl] = useState(false)
    const [commenting, setCommenting] = useState(false)
    const [compliteFilter, setCompliteFilter] = useState(false)

    useEffect(() => {
        get({ url: `comments/allForLesson/${lessonId}`, dispatch, token })
            .then(json => {
                const isComment = json?.comments.some(com => com.userId == id);
                setCommenting(isComment)
            })
        get({ url: `comments/filter`, dispatch, token })
            .then(json => {
                const isCommentFilter = json?.comments.some(com => com.userId == id);
                setCompliteFilter(isCommentFilter)
            })
        get({ url: `lessons/allCompliteUser/${id}`, dispatch, token })
            .then(json => {
                const isComplite = json?.lessons.some(les => les.lessonId == lessonId);
                setCompl(isComplite)
                setComplite(isComplite)
            })
    }, [token])

    return (
        compl && !commenting && !compliteFilter &&
        <div className="container">
            <Title type={3} title={'Оставь отзыв о полученном опыте'} />
            <HandleRating onRatingChange={setUserRating} />
            <textarea type="text" value={textComment} onChange={e => setTextComment(e.target.value)} className="mb-5" placeholder="Текст отзыва" required />
            <button className={styleButton} onClick={handleButtonPostComment}>отправить</button>
        </div>
    )
}