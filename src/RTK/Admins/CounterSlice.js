import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import axios from "axios";
import StatusCode from "../../StatusCode";
import { toast } from "react-toastify";


// For Filter Reservation
export const filterAPI = createAsyncThunk('admin/filter' , async(args , thunkAPI)=>{
    const {rejectWithValue} = thunkAPI ; 
    try{
        const response = await axios.post(`${BASE_URL}/admin/advancedSearch?userName=${args.userName}&level_id=${args.level_id}&faculty_id=${args.faculty_id}&date=${args.date}&examType=${args.examType}` , {
            
        } , {
            headers : {
                Authorization :`Bearer ${args.token}`
            }
        })
        return response.data

    }catch(error){
        return rejectWithValue(error)
    }

})

// For Get ALl Reservations 
export const getAllReservationListAPI = createAsyncThunk('admin/getReservations' ,  async (args , thunkAPI) =>{
    const {rejectWithValue} = thunkAPI
    console.log(`the ARGGSS PAge ${args.page}`)
    try{    
        const response = await axios.get(`${BASE_URL}/reservations/?page=${args.page}&limit=3&searchKey=${args.search? args.search : ""}` , {
            headers : {
                Authorization : `Bearer ${args.token}`
            }
        }) ; 

        console.log(response.data) ;
        return response.data 

    }catch(error){
        return rejectWithValue(error)
    }
})

// For Accept and Decline Request
export  const acceptOrDeclineAPI = createAsyncThunk('counter/acceptordecline' , async (args , thunkAPI) =>{
    const {rejectWithValue , dispatch , getState} = thunkAPI
    try{
        const response = await axios.patch(`${BASE_URL}/admin/acceptOrDecline/${args.medxId}` , {
            operation:args.res
        } , {
            headers : {
                Authorization : `Bearer ${args.token}`
            }
        })
        dispatch(getAllReservationListAPI({token :args.token , page : args.page , searchKey : ""}))
        console.log(response) ;
    } catch(error){
        return rejectWithValue(error) ; 
    }
})

const initialState = {
    data : null ,
    totalPage : null , 
    currentPage : null , 
    status : StatusCode.IDLE
}

const CounterSlice = createSlice({
    name : "counter" , 
    initialState , 
    reducers : {

    } ,
    extraReducers : (builder)=>{
        // For Get All Reservation 
        builder.addCase(getAllReservationListAPI.fulfilled , (state ,action)=>{
            console.log('Rservation Returned Successfully') ; 
            console.log(action.payload)
            state.status = StatusCode.SUCCESS ; 
            state.data = action.payload.results ; 
            state.totalPage = action.payload.totalPages
            state.currentPage = action.payload.currentPage
        })
        .addCase(getAllReservationListAPI.pending , (state ,action)=>{
            state.status = StatusCode.LOADING ; 
        })
        // For Accept or Decline 
        .addCase(acceptOrDeclineAPI.fulfilled , (state ,action)=>{
        })
        // For Filter API
        .addCase(filterAPI.fulfilled , (state , action)=>{
            toast.success("تم البحث بنجاح")
        })
        .addCase(filterAPI.pending , (state ,action)=>{
            // state.status = StatusCode.LOADING ;
        })
        .addCase(filterAPI.rejected , (state , action)=>{
            toast.error("حدث خطا برجاء المحاولة مرة اخري") ;
            // state.status = StatusCode.ERROR ; 
        })
    }
})


export default CounterSlice.reducer ; 

export const getReservationData = state => state.CounterSlice