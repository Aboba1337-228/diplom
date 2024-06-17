export const Title = ({ type, position, title, onClick, children, secondTitle }) => {
    if (type == '1') {
        return (
            <div className={position + " mb-5"} onClick={onClick}>
                <h2>{title}</h2>
                {children}
            </div>
        )
    }
    if (type == '2') {
        return (
            <div className="flex justify-between items-center mb-5" onClick={onClick}>
                <div className="sm:flex gap-5 items-center">
                    <h2 className="mb-5">{title}</h2>
                    {children}
                </div>
                <p className="text-right">зз - завершили занятие;<br />оп - отправлено приглашение</p>
            </div>
        )
    }
    if (type == '3') {
        return (
            <div className={`flex mb-5 ${position}`} onClick={onClick}>
                <h3>{title}</h3>
                {children}
            </div>
        )
    }
    if (type == '4') {
        return (
            <div className={`flex mb-2 ${position}`} onClick={onClick}>
                <h4>{title}</h4>
                {children}
            </div>
        )
    }
    if (type == '5') {
        return (
            <div className={`flex mb-5 ${position}`} onClick={onClick}>
                <h5>{title}</h5>
                {children}
            </div>
        )
    }
    if (type == '6') {
        return (
            <div className={position + " mb-5 "} onClick={onClick}>
                <div className="">
                    <h2>{title}</h2>
                    <p>{secondTitle}</p>
                </div>
                {children}
            </div>
        )
    }
}