import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { regThunk } from "../redux/regSlice"
import { useNavigate } from "react-router-dom"

export const Reg = () => {
    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [birth, setBirth] = useState('')
    const [password, setPassword] = useState('')
    const [checkbox, setCheckbox] = useState(false)

    const regState = useSelector((state) => state.reg)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (regState.message == 'Пользователь успешно зарегистрирован.') {
            navigate('/auth')
        }
    }, [regState])

    const handleCheckbox = () => {
        setCheckbox(prev => !prev)
    }
    console.log(regState.error)
    return (
        <div className="container column aling-center">
            <h1 className="mb-8">Регистрация</h1>
            <div className="flex flex-col sm:w-min mb-5">
                <input type="text" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Фамилия ребенка" required />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Имя ребенка" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ваша эл. почта" required />
                <input type="date" value={birth} onChange={e => setBirth(e.target.value)} placeholder="Дата рождения ребенка" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
                <div className="checkbox">
                    <input type="checkbox" name="checkbox" id="checkbox" checked={checkbox} onChange={handleCheckbox} required />
                    <label htmlFor="checkbox">Я согласен на обработку моих персональных данных и персональных данных моего ребенка (опекуна) и согласен с <a className="underline">политикой конфиденциальности</a></label>
                </div>
                {
                    !Array.isArray(regState.error) && regState.error && <p style={{ color: "red" }}>{regState.error}</p>
                }
                {
                    !Array.isArray(regState.message) && regState.message && <p style={{ color: "red" }}>{regState.message}</p>
                }
                {
                    Array.isArray(regState.error) && regState.error.length > 0 && <p style={{ color: "red" }}>{regState.error[0].msg}</p>
                }
                {
                    Array.isArray(regState.error) && regState.error.length > 1 && <p style={{ color: "red" }}>{regState.error[1].msg}</p>
                }

            </div>
            {
                checkbox ?
                    <button className="bg-white text-black" onClick={() => {
                        dispatch(regThunk({
                            surname,
                            name,
                            email,
                            birthday: birth,
                            password
                        }))
                    }}>зарегистрироваться</button>
                    :
                    <button className="bg-gray-600 text-white" disabled>зарегистрироваться</button>

            }
        </div>

    )
}