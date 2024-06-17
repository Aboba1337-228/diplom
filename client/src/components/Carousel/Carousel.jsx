import { useState } from "react"
import left from "../../assets/toleft.png"
import right from "../../assets/toright.png"

export const Carousel = ({ title, children, summaSlides, numSlides }) => {
    const [currentCount, setCurrentCount] = useState(0)

    let number
    numSlides == 1 ? number = summaSlides - 1 : number = Math.floor(summaSlides / numSlides)

    const toRight = () => {
        (currentCount > number - 1) ? setCurrentCount(0) : setCurrentCount(currentCount + 1)
    }

    const toLeft = () => {
        (currentCount == 0) ? setCurrentCount(number) : setCurrentCount(currentCount - 1)
    }

    return (
        <div className="container">
            <div className="flex flex-col items-center mb-7 sm:mb-3 sm:flex-row justify-between w-full">
                {title}
                {
                    number > 0 &&
                    <div className="">
                        <button onClick={() => toLeft()} className="bg-white pt-2 pr-3 pb-3 pl-2 rounded-lg mr-2">
                            <img src={left} alt="" />
                        </button>
                        <button onClick={() => toRight()} className="bg-white pt-2 pr-3 pb-3 pl-2 rounded-lg">
                            <img src={right} alt="" />
                        </button>
                    </div>
                }
            </div>
            <div className="overflow-hidden">
                <div className="flex gap-[2%] w-full transition-transform duration-1000 ease-in-out" style={{
                    transform: `translateX(-${currentCount * 102}%)`
                }}>
                    {children}
                </div>
            </div>
        </div>
    )
}