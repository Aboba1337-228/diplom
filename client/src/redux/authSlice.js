import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    error: undefined,
    id: localStorage.getItem('id'),
    token: localStorage.getItem('token'),
    isSayHi: localStorage.getItem('isSayHi')
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: (state) => {
            state.loading = false
            state.error = undefined
            state.id = undefined
            state.token = undefined
            state.isSayHi = undefined

            localStorage.removeItem("id")
            localStorage.removeItem("token")
            localStorage.removeItem("isSayHi")
        },
        sayHi: (state) => {
            state.isSayHi = false

            localStorage.setItem('isSayHi', false)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authThunk.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(authThunk.fulfilled, (state, action) => {
            const payload = action.payload

            state.message = payload.message
            if (payload.user && payload.token) {
                state.id = payload.user?.id
                state.token = payload.token
                state.isSayHi = true

                localStorage.setItem("id", payload.user?.id)
                localStorage.setItem("token", payload.token)
                localStorage.setItem("isSayHi", true)

                state.error = undefined
                state.loading = false
            }
        })
        builder.addCase(authThunk.rejected, (state, action) => {
            const payload = action.payload

            state.error = payload.message
            state.loading = false
        })
    }
})

export const authThunk = createAsyncThunk('authThunk', async (data, { rejectWithValue }) => {
    try {
        const response = await fetch(`http://localhost:8080/api/users/auth`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const json = await response.json()
        if (response.status == 400) {
            return rejectWithValue(json)
        }
        return json
    } catch (error) {
        console.log(error);
        return rejectWithValue(error)
    }
})

export const { logOut, sayHi } = authSlice.actions
export default authSlice.reducer