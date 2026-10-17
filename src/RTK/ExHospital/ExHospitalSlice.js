import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../API_Route/axiosClient";
import StatusCode from "../../StatusCode.js";

export const getAllExhospitalsAPI = createAsyncThunk('exhospital/getall', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await apiClient.get('/sysdata/hospitals');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to fetch hospital", error: error.message });
    }
});

export const deleteExhospitalAPI = createAsyncThunk('exhospital/delete', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const id = args?.data ?? args;
    try {
        const response = await apiClient.delete(`/sysdata/hospitals/${id}`);
        dispatch(getAllExhospitalsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to delete exhospital", error: error.message });
    }
});

export const addNewExhospitalAPI = createAsyncThunk('exhospital/add', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
        const response = await apiClient.post('/sysdata/hospitals', args?.data || args);
        dispatch(getAllExhospitalsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to add exhospital", error: error.message });
    }
});

export const updateExhospitalAPI = createAsyncThunk('exhospital/update', async (args, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const payload = args?.data || args;
    try {
        const response = await apiClient.put(`/sysdata/hospitals/${payload.id}`, payload);
        dispatch(getAllExhospitalsAPI());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to update exhospital", error: error.message });
    }
});


const initialState = {
    data: [],
    status: StatusCode.IDLE
}

const exHospitalSlice = createSlice({
    name: "exhospital",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        //* For Get All exhospitals
        builder.addCase(getAllExhospitalsAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data = action.payload;
            state.status = StatusCode.IDLE
        })
        builder.addCase(getAllExhospitalsAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllExhospitalsAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //! For Delete exhospital
        builder.addCase(deleteExhospitalAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data = state.data.filter(item => item.exhospital_id !== action.payload.exhospital_id)
            state.status = StatusCode.IDLE
        })
        builder.addCase(deleteExhospitalAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteExhospitalAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //? For Add exhospital
        builder.addCase(addNewExhospitalAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data.push(action.payload)
            state.status = StatusCode.IDLE
        })
        builder.addCase(addNewExhospitalAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewExhospitalAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //? For Update exhospital
        builder.addCase(updateExhospitalAPI.fulfilled, (state, action) => {
            console.log("Successs")
            console.log(state.data)
            const index = state.data.findIndex(item => item.exhospital_id === action.payload.exhospital_id)
            state.data[index] = action.payload
            state.status = StatusCode.IDLE
        })

        builder.addCase(updateExhospitalAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateExhospitalAPI.rejected, (state, action) => {
            console.log("REJJjjjected", action.payload)
            state.status = StatusCode.ERROR
        })
    }
})


export default exHospitalSlice.reducer
export const getAllExhospitals = state => state.exHospitalSlice.data; 
