import { useNavigate } from "react-router-dom"

export default function CardLesson({ id, name, img, style }) {
    const navigate = useNavigate()

    return (
        <div className={`flex flex-col col-span-1 bg-white rounded-xl box-shadow h-full ${style}`} onClick={() => navigate(`../lessons/${id}`)}>
            <div className="h-4/5 sm:h-3/4 overflow-hidden">
                <img className="object-cover h-full w-full" src={`http://localhost:8080/${img}`} alt="изображение карточки урока" />
            </div>
            <div className="my-auto pl-4">
                <h6 className="text-black">{name}</h6>
            </div>
        </div>
    )
}