import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import { toast } from "react-toastify";


export const createReservationUserAPI = createAsyncThunk('reservation/createReservationUser' ,async (args , thunkAPI)=>{
    const {rejectWithValue} = thunkAPI ; 
    console.log(`the Args`)
    console.log(args) ; 
    try{
        const response = await axios.post(`${BASE_URL}/Myreservations/${args.id}` , args.data , {
            headers : {
                Authorization : `Bearer ${args.token}` , 
                'Content-Type': 'application/json'
            }
        } )
        console.log(response)
    }catch(error){
        console.log(error.message)
        return rejectWithValue(error)
    }
})


const initialState = [] ; 

const ReservationSlice = createSlice({
    name : "reservation" , 
    initialState ,
    reducers : {

    } , 
    extraReducers : (builder) =>{
        builder.addCase(createReservationUserAPI.fulfilled , (state ,action)=>{
            toast.success("تم حجز الكشف بنجاح برجاء احضار الكرنية واذن الكلية ")
        })
        builder.addCase(createReservationUserAPI.rejected , (state ,action)=>{
            
        })
    }
})


export default ReservationSlice.reducer ; 
