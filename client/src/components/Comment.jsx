import StarRating from "./starRating"
import { useEffect, useState } from "react"
import { get, post } from "../hooks/fetchForm"

export default function Comment({ type, token, dispatch, commentId, statusId, lessonId, userId, rating, text, comments, setComments }) {
    const [nameLesson, setNameLesson] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')

    useEffect(() => {
        if (lessonId) {
            get({ url: `lessons/findLesson/${lessonId}`, dispatch, token })
                .then(json => setNameLesson(json?.lesson?.name));
        }

        if (userId) {
            get({ url: `users/find/${userId}`, dispatch, token })
                .then(json => {
                    setName(json?.user?.name);
                    setSurname(json?.user?.surname)
                });
        };
    }, [token, lessonId])

    function handleStatusChange(statusId) {
        post({
            url: `comments/changeStatus`, dispatch, token, data: {
                commentId,
                statusId
            }
        });
        setComments(comments.filter(comm => comm.id != commentId));
    };

    function deleteComment() {
        get({ url: `comments/delete/${commentId}`, dispatch, token });
        setComments(comments.filter(comm => comm.id != commentId));
    };

    if (type == 1) {
        return (
            <div className="flex flex-col gap-7 blue box-shadow rounded-2xl p-4 sm:grid sm:gap-0 sm:items-center sm:grid-cols-4 lg:grid-cols-7">
                <div className="block lg:grid lg:grid-cols-3 lg:col-span-3">
                    <h6 className="">{nameLesson}</h6>
                    <h6 className="">{name} {surname}</h6>
                    <StarRating rating={rating} />
                </div>
                <p className="col-span-2 lg:col-span-3">{text}</p>
                <div className="flex flex-col gap-3">
                    <button className="bg-white text-black"
                        onClick={() => handleStatusChange("Принят")}>принять</button>
                    <button className="bg-red-400"
                        onClick={() => handleStatusChange("Отклонен")}>отклонить</button>
                </div>
            </div>
        )
    }
    if (type == 2) {
        return (
            <div className="flex flex-col gap-7 blue box-shadow rounded-2xl p-4 sm:grid sm:gap-0 sm:items-center sm:grid-cols-4 lg:grid-cols-6">
                <h6 className="col-span-1">{name} {surname}</h6>
                <StarRating rating={rating} />
                <p className="col-span-2 lg:col-span-4">{text}</p>
            </div>
        )
    }
    if (type == 3) {
        return (
            <div className="flex flex-col gap-7 blue box-shadow rounded-2xl p-4 sm:grid sm:gap-0 sm:items-center sm:grid-cols-5 lg:grid-cols-7">
                <h6 className="col-span-1">{name} {surname}</h6>
                <StarRating rating={rating} />
                <p className="col-span-2 lg:col-span-4">{text}</p>
                <button className="bg-red-400" onClick={deleteComment}>удалить</button>
            </div>
        )
    }
    if (type == 4) {
        return (
            <div className="flex flex-col gap-7 blue box-shadow rounded-2xl p-4 sm:grid sm:gap-0 sm:items-center sm:grid-cols-6 lg:grid-cols-7">
                <h6 className="col-span-1">{nameLesson}</h6>
                <h6 className="col-span-1">{statusId}</h6>
                <StarRating rating={rating} />
                <p className="col-span-2 lg:col-span-3">{text}</p>
                <button className="bg-red-400" onClick={deleteComment}>удалить</button>
            </div>
        )
    }
}