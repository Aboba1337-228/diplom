import Earth from '../assets/Earth.png'
import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import img4 from '../assets/img4.png'
import img5 from '../assets/img5.png'
import img6 from '../assets/img6.png'
import img7 from '../assets/img7.png'
import img8 from '../assets/img8.png'

export const MainImage = () => {
    return (
        <div className="hidden sm:block absolute h-[90%] aspect-square left-1/2 -translate-x-1/2 z-10">
            <div className="relative flex flex-col items-center w-full h-full">
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden left-1/2 -translate-x-1/2 top-0 box-shadow hover:w-[21%] transition-all">
                    <img src={img1} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute h-[50%] w-[50%] top-[20%] left-1/2 -translate-x-1/2">
                    <img src={Earth} alt="" style={{objectFit: 'contain',
                        height: '100%',
                        width: 'auto'
                    }} className="h-full mx-auto" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden right-[12%] top-[12%] box-shadow hover:w-[21%] transition-all">
                    <img src={img2} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden right-0 top-1/2 -translate-y-1/2 box-shadow hover:w-[21%] transition-all">
                    <img src={img3} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden right-[12%] bottom-[12%] box-shadow hover:w-[21%] transition-all">
                    <img src={img4} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden bottom-0 left-1/2 -translate-x-1/2 box-shadow hover:w-[21%] transition-all">
                    <img src={img5} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden left-[12%] bottom-[12%] box-shadow hover:w-[21%] transition-all">
                    <img src={img6} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden left-0 top-1/2 -translate-y-1/2 box-shadow hover:w-[21%] transition-all">
                    <img src={img7} alt="" className="object-cover h-full w-full" />
                </div>
                <div className="absolute w-[20%] aspect-square rounded-[50%] overflow-hidden left-[12%] top-[12%] box-shadow hover:w-[21%] transition-all">
                    <img src={img8} alt="" className="object-cover h-full w-full" />
                </div>
            </div>
        </div>
    )
}