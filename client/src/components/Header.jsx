import { jwtDecode } from "jwt-decode"
import { useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"

export const Header = () => {
    const token = useSelector((state) => state.auth.token)
    const navigate = useNavigate()
    const location = useLocation()
    let jwt
    token ? jwt = jwtDecode(token) : null

    return (
        <header className="flex justify-between container my-3">
            <Link to={'/'} className="aling-middle font-['Aqum_Two'] font-small-caps"><h4>ДетиВДеле</h4></Link>
            <div className="flex gap-5 items-center">
                {
                    jwt?.roleId == 'ADMIN' &&  <Link to={'../../users'}>пользователи</Link>
            }
                <button onClick={token ? () => navigate('/profile') :
                    location.pathname == '/auth' ? () => navigate('/reg') : () => navigate('/auth')} className="bg-white text-black text-sm pt-1 pr-7 pb-3 pl-6 sm:text-xl sm:pt-1 sm:pr-9 sm:pb-4 sm:pl-8">{token ? "профиль" : location.pathname == '/auth' ? "зарегистрироваться" : "вход"}</button>
            </div>
        </header>
    )
}