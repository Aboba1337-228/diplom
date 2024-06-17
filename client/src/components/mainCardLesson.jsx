import { useNavigate } from "react-router-dom"

export const MainCardLesson = ({ id, nameLesson, img, numStudents, numInvite, ageUnder, ageUp, visible }) => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col relative overflow-hidden rounded-xl blue box-shadow" onClick={() => navigate(`/lessons/${id}`)} >
            <div className=" h-4/5 sm:h-3/4 overflow-hidden ">
                <img className="object-cover h-full w-full" src={`http://localhost:8080/${img}`} alt="изображение" />
            </div>
            <div className="absolute top-3 right-3 bg-white py-1 px-2 rounded-xl text-black">{ageUnder}-{ageUp} лет</div>
            <div className="flex justify-between items-center mx-5 my-auto">
                <h5 className="truncate">{nameLesson}</h5>
                {
                    visible &&
                    <div className="flex gap-3">
                        <div className="bg-white py-1 px-2 rounded-xl text-black">зз {numStudents}</div>
                        <div className="bg-white py-1 px-2 rounded-xl text-black">оп {numInvite}</div>
                    </div>
                }
            </div>
        </div>
    )
}