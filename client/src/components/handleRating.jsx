import { useState } from "react"

function HandleRating({ totalStars = 5, onRatingChange }) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)

    const handleSetRating = (index) => {
        setRating(index);
        if (onRatingChange) {
            onRatingChange(index);
        }
    };

    return (
        <div className="flex mb-5">
            {
                [...Array(5)].map((star, index) => {
                    index += 1
                    return (
                        <div
                            role="button"
                            tabIndex={0}
                            key={index}
                            className={index <= (hover || rating) ? "star gold cursor-pointer" : "cursor-pointer star"}
                            onClick={() => handleSetRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSetRating(index);
                                }
                            }}
                        />
                    )
                })
            }
        </div>
    )
}

export default HandleRating;