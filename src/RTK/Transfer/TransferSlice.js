import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import { toast } from "react-toastify";
import StatusCode from "../../StatusCode";
import { getAllReservationListAPI } from "../Admins/CounterSlice";



// For Update Transfer 
export const updateTransferAPI = createAsyncThunk('transfer/update' , async (args , thunkAPI)=>{

    const {rejectWithValue , dispatch} = thunkAPI

    console.log(`The Args Update ` ) ;
    console.log(args ) ; 
    
    try{
        const response = await axios.put(`${BASE_URL}/admin/transfer/${args.data.transfer_id}` , {

                student_id:args.data.student_id,
                transferReason: "لطف",
                notes: "مش دوكش",
                exHosp_id: parseInt(args.data.hospital)
            
        } , {
            headers : {
                'Content-Type': 'application/json', 
                Authorization : `Bearer ${args.token}` 
            }
        })
        dispatch(getAllReservationListAPI({token : args.token , page :args.page ? args.page :1 , searchKey : ""}))

    }catch(error){
        return rejectWithValue(error) ; 
    }
})

// For Transfer Student
export  const transferAPI = createAsyncThunk('transfer/make' , async (args , thunkAPI)=>{
    const {rejectWithValue , dispatch} = thunkAPI ;
    console.log(`The Args Is :`)
    console.log(args) ; 
    try{
        const response = await axios.post(`${BASE_URL}/admin/transfer` , {
            student_id:args.data.student_id,
            transferReason : "لايوجود",
            notes: "مش دوكش",
            medicEx_id:args.data.medicEx_id,
            clinic_id:args.data.clinic_id,
            exHosp_id:args.data.hospital
        }, {
            headers :{
                'Content-Type': 'application/json', 
                Authorization : `Bearer ${args.token}` 

            }
        })
        dispatch(getAllReservationListAPI({token : args.token , page :args.page ? args.page :1 , searchKey : ""}))
        console.log(response ) ;
        return args.data.student_name 

    }catch(error){
        return rejectWithValue(error) ; 
    }
})

const initialState = {
    status : StatusCode.IDLE 
}

const TransferSlice = createSlice({
    name : "transfer" , 
    initialState ,
    reducers : {

    } , 
    extraReducers : (builder)=>{
        // For Transfer Student
        builder.addCase(transferAPI.fulfilled , (state , action)=>{
            toast.success(`تم تحويل الطالب بنجاح`) ;
            state.status = StatusCode.SUCCESS ;  

        })
        builder.addCase(transferAPI.pending , (state , action)=>{
            state.status = StatusCode.LOADING ; 
        })
        builder.addCase(transferAPI.rejected , (state , action)=>{
            state.status = StatusCode.ERROR ; 
            console.log(action.payload)
        })
        // For Update Transfer Student 
        builder.addCase(updateTransferAPI.fulfilled , (state ,action)=>{
            toast.success("تم تعديل البينات بنجاح")
        })
        builder.addCase(updateTransferAPI.pending , (state ,action)=>{
        })
        builder.addCase(updateTransferAPI.rejected , (state ,action)=>{
            toast.error("حدث خطا برجاء المحاولة مرة اخري")
        })
    }
})


export default TransferSlice.reducer ; 
