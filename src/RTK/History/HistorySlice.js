import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";



export const getAllHistoryAPI = createAsyncThunk('history/getall', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.get(`${BASE_URL}/admin/logs?page=${args.page}&limit=5` , {
            headers :{
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {

        return rejectWithValue(error.response)
    }
})

export const deleteHistoryAPI = createAsyncThunk('history/delete', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.delete(`${BASE_URL}/admin/logs` , {
            headers :{
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const initialState = {
    data: [],
    status: StatusCode.IDLE
}

const HistorySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        clearHistory: (state) => {
            state.data = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllHistoryAPI.fulfilled, (state, action) => {
                state.data = action.payload
                state.status = StatusCode.IDLE
            })

            .addCase(getAllHistoryAPI.pending, (state, action) => {
                state.status = StatusCode.LOADING
            }
            )
            .addCase(getAllHistoryAPI.rejected, (state, action) => {
                state.status = StatusCode.FAILED
            })

            .addCase(deleteHistoryAPI.fulfilled, (state) => {
                state.data = [];
                state.status = StatusCode.IDLE;
            })
            .addCase(deleteHistoryAPI.pending, (state, action) => {
                state.status = StatusCode.LOADING
            })
            .addCase(deleteHistoryAPI.rejected, (state, action) => {
                state.status = StatusCode.FAILED
            })
    }
}
)
export const { clearHistory } = HistorySlice.actions
export default HistorySlice.reducer
export const getAllHistory = (state) => state.HistorySlice.data;

