import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";



export const getAllClinicsAPI = createAsyncThunk('clinic/getall', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.get(`${BASE_URL}/sysdata/clinics`,{
            headers: {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        console.log("inside Slice")
        console.log(data)
        return data
    } catch (error) {

        return rejectWithValue(error.response)
    }

})

export const deleteClinicsAPI = createAsyncThunk('clinic/delete', async (args, thunkAPI) => {
    const { rejectWithValue , getState , dispatch } = thunkAPI ;
    const token = getState().UserSlice.token ; 

    try {
        const { data } = await axios.delete(`${BASE_URL}/sysdata/clinics/${args.data}` , {
            headers :{ 
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        dispatch(getAllClinicsAPI({token})) ; 

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const addNewClinicsAPI = createAsyncThunk('clinic/add', async (args, thunkAPI) => {
    const { rejectWithValue , getState , dispatch } = thunkAPI
    const token = getState().UserSlice.token ; 
    try {
        const { data } = await axios.post(`${BASE_URL}/sysdata/clinics`, args.data ,{
            headers : {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        } )

        dispatch(getAllClinicsAPI({token :args.token})) ; 
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const updateClinicsAPI = createAsyncThunk('clinic/update', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.put(`${BASE_URL}/sysdata/clinics/${args.data.id}`, args.data , {
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

const ClinicSlice = createSlice({
    name: "clinic",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        //* For Get All Clinics
        builder.addCase(getAllClinicsAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data = action.payload;
            state.status = StatusCode.IDLE
        })
        builder.addCase(getAllClinicsAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllClinicsAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //! For Delete Clinic
        builder.addCase(deleteClinicsAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data = state.data.filter(item => item.clinic_id !== action.payload.clinic_id)
            state.status = StatusCode.IDLE
        })
        builder.addCase(deleteClinicsAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteClinicsAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //? For Add Clinic
        builder.addCase(addNewClinicsAPI.fulfilled, (state, action) => {
            console.log("Successs")
            state.data.push(action.payload)
            state.status = StatusCode.IDLE
        })
        builder.addCase(addNewClinicsAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewClinicsAPI.rejected, (state, action) => {
            console.log("REJJjjjected")
            state.status = StatusCode.ERROR
        })

        //? For Update Clinic
        builder.addCase(updateClinicsAPI.fulfilled, (state, action) => {
            console.log("Successs");
            console.log("desfdsfdgfsdg", state.data);
            const index = state.data.findIndex(item => item.clinic_id === action.payload.clinic_id);
            state.data[index] = action.payload;
            state.status = StatusCode.IDLE;
        })
        builder.addCase(updateClinicsAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateClinicsAPI.rejected, (state, action) => {
            console.log("REJJjjjected", action.payload)
            state.status = StatusCode.ERROR
        })
    }
})


export default ClinicSlice.reducer


export const getAllClinics = state => state.ClinicSlice.data;
