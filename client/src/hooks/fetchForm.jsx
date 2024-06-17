import { logOut } from "../redux/authSlice";

export const get = async ({ url, dispatch, token }) => {
    const json = await fetch(`http://localhost:8080/api/${url}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                // Если получен статус 401 или 403, выполняем выход из аккаунта
                // Например, очищаем локальное хранилище и перенаправляем пользователя на страницу входа
                dispatch(logOut())
            }
            return response.json();
        })
        .catch(error => console.log('Error fetching data:', error));

    return json
}

export const post = async ({ url, dispatch, token, data }) => {
    const json = await fetch(`http://localhost:8080/api/${url}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                // Если получен статус 401 или 403, выполняем выход из аккаунта
                // Например, очищаем локальное хранилище и перенаправляем пользователя на страницу входа
                dispatch(logOut())
            }
            return response.json();
        })
        .catch(error => console.log('Error fetching data:', error));

    return json
} 

export const postForFormdata = async ({ url, dispatch, token, formdata }) => {
    const json = await fetch(`http://localhost:8080/api/${url}`, {
        method: "POST",
        mode: 'cors',
        // headers: {
        //     "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>"
        // },
        body: formdata
    })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                // Если получен статус 401 или 403, выполняем выход из аккаунта
                // Например, очищаем локальное хранилище и перенаправляем пользователя на страницу входа
                dispatch(logOut())
            }
            return response.json();
        })
        .catch(error => console.log('Error fetching data:', error));

    return json
} 