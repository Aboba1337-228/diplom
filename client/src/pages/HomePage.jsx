import { Carousel } from "../components/Carousel/Carousel"
import { MainImage } from "../components/MainImage"
import { useNavigate } from "react-router-dom"
import { Title } from "../components/Title"
import useWindowSize from "../hooks/windowSize"
import photo1 from "../assets/photo1.png"
import photo2 from "../assets/photo2.png"
import photo3 from "../assets/photo3.png"
import photo4 from "../assets/photo4.png"
import photo5 from "../assets/photo5.png"

export const HomePage = () => {
    const navigate = useNavigate()
    const { width, height } = useWindowSize();
    const numSlides = width > 1024 ? 3 : width > 640 ? 2 : 1

    const cards = [
        {
            title: "Искусство и ремесла",
            elements: [
                "Рисование и живопись",
                "Творческая мастерская (работа с разными материалами)",
                "Графический дизайн",
                "Лепка и резьба по дереву или глине",
                "Ткачество и вышивка",
                "Фотография и видеосъемка",
                "Выжигание по дереву и декоративная роспись",
                "Создание украшений и аксессуаров",
                "Мастер-классы по созданию поделок и подарков"
            ]
        },
        {
            title: "Спорт и физическая активность",
            elements: [
                "Футбол, баскетбол, волейбол",
                "Плавание и водные виды спорта",
                "Теннис и настольный теннис",
                "Художественная гимнастика и акробатика",
                "Йога и стретчинг",
                "Скалолазание и альпинизм"
            ]
        },
        {
            title: "Музыка и танцы",
            elements: [
                "Игра на музыкальных инструментах (гитара, фортепиано, скрипка и т.д.)",
                "Вокал и хоровое пение",
                "Танцевальные направления (бальные, современные, народные танцы)",
                "Уроки дирижирования",
                "Звукозапись и звукорежиссура"
            ]
        },
        {
            title: "Наука и технологии",
            elements: [
                "Робототехника и программирование",
                "Научные эксперименты и лабораторные работы",
                "Компьютерная графика и анимация",
                "Веб-разработка и создание мобильных приложений",
                "Математические и научные кружки"
            ]
        },
        {
            title: "Литература и языки",
            elements: [
                "Литературный кружок (чтение и обсуждение книг)",
                "Изучение иностранных языков",
                "Писательский мастер-класс",
                "Разбор и анализ литературных произведений",
                "Театральная студия"
            ]
        },
    ]

    return (
        <>
            <div className="container flex flex-col justify-end sm:flex-row sm:justify-between items-center min-h-[90vh] sm:min-h-[80vh] relative">
                <div className="z-20 flex flex-col justify-center mb-24 sm:justify-start sm:mb-0">
                    <h1 className="text-center mb-5 sm:text-start">ДетиВДеле</h1>
                    <p className="text-center sm:text-start">веб-приложение для детей и подростков,<br /> помогающее выбрать дополнительные<br /> общеразвивающие направления</p>
                </div>
                <MainImage />
                <div className="flex flex-col items-center gap-8 sm:gap-6 z-20 mb-14 sm:items-end sm:mb-0">
                    <h3 className="text-center sm:text-right leading-7">Вместе к звездам:<br /> найди свой путь<br /> в мире возможностей!</h3>
                    <button onClick={() => navigate('/reg')} className="bg-blue-300 flex-1 w-[100%] sm:flex-grow-0 sm:w-auto">начать</button>
                </div>
            </div>
            <div className="container">
                <Title type={1} position={'text-center'} title={'Кто мы?'} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="rounded-xl overflow-hidden box-shadow">
                        <img src={photo1} alt="" />
                    </div>
                    <div className="rounded-lg overflow-hidden box-shadow blue flex justify-center items-center p-3">
                        <p className="text-center leading-5 text-xs  lg:text-xl">Управление по культуре и искусству администрации города Оренбурга <span className="font-semibold">запустило проект для детей Оренбуржья, который поможет им</span> раскрыть свои таланты и развить навыки</p>
                    </div>
                    <div className="rounded-lg overflow-hidden box-shadow">
                        <img src={photo2} alt="" />
                    </div>
                    <div className="rounded-lg overflow-hidden box-shadow hidden sm:block">
                        <img src={photo3} alt="" />
                    </div>
                    <div className="rounded-lg overflow-hidden box-shadow hidden md:block">
                        <img src={photo4} alt="" />
                    </div>
                    <div className="rounded-lg overflow-hidden box-shadow hidden md:block">
                        <img src={photo5} alt="" />
                    </div>
                </div>
            </div>
            <Carousel title={<h2 className="mb-7">Направления</h2>} summaSlides={cards.length} numSlides={numSlides}>
                {
                    cards.map((card, index) => (
                        <div className="flex flex-col items-center blue box-shadow rounded-lg px-7 py-7 min-w-full sm:min-w-[49%] lg:min-w-[32%]" key={index}>
                            <h5 className="text-center mb-5">{card.title}</h5>
                            <ul className="list-disc list-outside list-image-none mb-auto min-w-full" key={index}>
                                {
                                    card.elements.map((el, index) => (
                                        <li className="mb-3 leading-5" key={index}>{el}</li>
                                    ))
                                }
                            </ul>
                            <button className="bg-white text-black mt-5" onClick={() => navigate('/reg')}>пройти пробное занятие</button>
                        </div>
                    ))
                }
            </Carousel>
        </>
    )
}