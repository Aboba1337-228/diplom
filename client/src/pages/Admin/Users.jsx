import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { get } from "../../hooks/fetchForm"
import { jwtDecode } from "jwt-decode"
import { dateType } from "../../hooks/dateType"

export default function Users() {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

    let jwt
    token ? jwt = jwtDecode(token) : null

    const id = jwt?.id

    useEffect(() => {
        get({ url: `users/all`, dispatch, token })
            .then(json => {
                const processedUsers = json.users.filter(user => user.id != id).map(user => {
                    const processedBirthday = user.birthday ? dateType(user.birthday) : null;
                    return { ...user, birthday: processedBirthday }
                })
                setUsers(processedUsers)
            })
    }, [token])

    const deleteUser = (id) => {
        get({ url: `users/delete/${id}`, dispatch, token })
            .then(json => {
                alert(json.message);
                setUsers(users.filter(user => user.id !== id))
            })
    }

    return (
        <div className="container">
            <div className=" overflow-auto">
                <table className="box-shadow">
                    <thead>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Эл. почта</th>
                            <th>Дата<br />рождения</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.surname}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.birthday}</td>
                                    <td><button className="bg-red-400 text-white" onClick={() => deleteUser(user.id)}>удалить</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}