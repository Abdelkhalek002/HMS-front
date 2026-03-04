import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";

export const getAllGovsAPI = createAsyncThunk('governorates/getAll', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.get(`${BASE_URL}/sysdata/governorates`)
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to fetch governorates", error: error.message });
    }
})

export const deleteGovernorateAPI = createAsyncThunk('governorates/delete', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.delete(`${BASE_URL}/sysdata/governorates/${args.data}` , {
            headers : {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to delete governorate", error: error.message });
    }
})

export const addNewGovernorateAPI = createAsyncThunk('governorates/add', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.post(`${BASE_URL}/sysdata/governorates`, args.data , {
            headers : {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to add governorate", error: error.message });
    }
})

export const updateGovernorateAPI = createAsyncThunk('governorates/update', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.put(`${BASE_URL}/sysdata/governorates/${args.data.id}`, args.data , {
            headers : {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to update governorate", error: error.message });
    }
})

const initialState = {
    data: [],
    status: StatusCode.IDLE
}

const GovernorateSlice = createSlice({
    name: "governorates",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllGovsAPI.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = StatusCode.IDLE
        })
        builder.addCase(getAllGovsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllGovsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        builder.addCase(deleteGovernorateAPI.fulfilled, (state, action) => {
            state.data = state.data.filter(item => item.id !== action.payload.id)
            state.status = StatusCode.IDLE
        })
        builder.addCase(deleteGovernorateAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        builder.addCase(addNewGovernorateAPI.fulfilled, (state, action) => {
            state.data.push(action.payload)
            state.status = StatusCode.IDLE
        })
        builder.addCase(addNewGovernorateAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        builder.addCase(updateGovernorateAPI.fulfilled, (state, action) => {
            const index = state.data.findIndex(item => item.id === action.payload.id)
            state.data[index] = action.payload
            state.status = StatusCode.IDLE
        })
        builder.addCase(updateGovernorateAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateGovernorateAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })
    }
})

export default GovernorateSlice.reducer
export const getAllGovernorates = state => state.GovernorateSlice.data; 
