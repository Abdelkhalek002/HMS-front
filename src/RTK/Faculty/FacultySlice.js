import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";



export const getAllFacultiesAPI = createAsyncThunk('faculties/getall', async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.get(`${BASE_URL}/sysdata/faculties`)
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to fetch faculties", error: error.message });
    }
})

export const deleteFacultyAPI = createAsyncThunk('faculties/delete', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.delete(`${BASE_URL}/sysdata/faculties/${args.data}` , {
            headers :{
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to delete faculty", error: error.message });
    }
})

export const addNewFacultyAPI = createAsyncThunk('faculties/add', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.post(`${BASE_URL}/sysdata/faculties`, args.data , {
            headers : {
            Authorization: `Bearer ${args.token}`,
            'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to add faculty", error: error.message });
    }
})

export const updateFacultyAPI = createAsyncThunk('faculties/update', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.put(`${BASE_URL}/sysdata/faculties/${args.data.id}`, args.data , {
            headers : {
            Authorization: `Bearer ${args.token}`,
            'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue({ message: "Failed to update faculty", error: error.message });
    }
})


const initialState = {
    data: [],
    status: StatusCode.IDLE
}

const FacultySlice = createSlice({
    name: "faculties",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        //* For Get All Faculties
        builder.addCase(getAllFacultiesAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data = action.payload;
            state.status = StatusCode.IDLE
        })
        builder.addCase(getAllFacultiesAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllFacultiesAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //! For Delete Level
        builder.addCase(deleteFacultyAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data = state.data.filter(item => item.faculty_id !== action.payload.faculty_id)
            state.status = StatusCode.IDLE
        })
        builder.addCase(deleteFacultyAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteFacultyAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //? For Add Level
        builder.addCase(addNewFacultyAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data.push(action.payload)
            state.status = StatusCode.IDLE
        })
        builder.addCase(addNewFacultyAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewFacultyAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //? For Update Level
        builder.addCase(updateFacultyAPI.fulfilled, (state, action) => {
            console.log("Successs")
            console.log(state.data)
            const index = state.data.findIndex(item => item.faculty_id === action.payload.faculty_id)
            state.data[index] = action.payload
            state.status = StatusCode.IDLE
        })

        builder.addCase(updateFacultyAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateFacultyAPI.rejected, (state, action) => {
            console.log("REJJjjjected", action.payload)
            state.status = StatusCode.ERROR
        })
    }
})


export default FacultySlice.reducer
export const getAllFaculties = state => state.FacultySlice.data; 




