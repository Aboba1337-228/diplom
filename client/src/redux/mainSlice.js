import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    message: undefined,
    error: undefined
}

export const mainSlice = createSlice({
    name: 'mainSlice',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false
            state.message = undefined
            state.error = undefined
        }
    },
    extraReducers: (builder) => {
        builder.addCase(mainThunk.pending, (state) => {
            state.loading = true
        })
        .addCase(mainThunk.fulfilled, (state, action) => {
            state.message = action.payload.message
            state.loading = false
        })
        .addCase(mainThunk.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
    }
})

export const mainThunk = createAsyncThunk('mainThunk', async ({ data, path, method }, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.token; 
        const response = await fetch(`http://localhost:8080/api/${path}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        if (!response.ok) {
            return rejectWithValue(json);
        }

        return json;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error);
    }
});

export const { reset } = mainSlice.actions;
export default mainSlice.reducer;