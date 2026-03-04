import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import { toast } from "react-toastify";
import StatusCode from "../../StatusCode";


// For Delete Reservation
export const deleteReservationAPI = createAsyncThunk('user/deleteReservation' , async (args , thunkAPI)=>{
    const {rejectWithValue } = thunkAPI
    console.log(args)
    try{
        const response = await axios.delete(`${BASE_URL}/myreservations/${args.userId}/${args.medxId}` , {
            headers : {
                Authorization : `Bearer ${args.token}`
            }
        })
        return args.medxId
    }catch(error){
        return rejectWithValue(error) ; 
    }
})

// For Get All Reservation
export const getUserReservationAPI = createAsyncThunk('user/getreservationlist' , async (args , thunkAPI)=>{
    const {rejectWithValue} = thunkAPI
    try{
        
        const response = await axios.get(`${BASE_URL}/myreservations/${args.id}?page=${args.page}&limit=5` , {
            headers : {
                Authorization : `Bearer ${args.token}` ,
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data)
        return response.data
    }catch(error){
        return rejectWithValue(error) ; 
    }
})

// For Update Profile Pic
export const updateProfilePicAPI = createAsyncThunk('user/updateProfilePic' , async (args , thunkAPI)=>{
    const {rejectWithValue , dispatch , getState} = thunkAPI
    try{
        const response = await axios.patch(`${BASE_URL}/myProfile/${args.id}` ,{userImage_file : args.data} , {
            headers : {
                Authorization : `Bearer ${args.token}` , 
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log("Inside Update Profile Pic Photo") ; 
        console.log(getState().AuthSlice.user) ; 

        dispatch(getUserProfileAPi({token :getState().AuthSlice.user.token  , id : getState().AuthSlice.user.payLoad.userId}) ) ;
        console.log(response)
    }catch(error){
        return rejectWithValue(error.message)
    }
})

// For Update Profile Data
export const updateProfileAPI = createAsyncThunk('user/updateProfile' , async (args , thunkAPI)=>{
    const {rejectWithValue} = thunkAPI
    try{
        const response = await axios.put(`${BASE_URL}/myProfile/${args.id}`, args.data , {
            headers :{
                Authorization : `Bearer ${args.token}` , 
                'Content-Type': 'application/json'
            }
        })
        console.log(response) ; 
    }catch(error){
        return rejectWithValue(error.message)
    }
})

// For Change Password
export const changePasswordAPI = createAsyncThunk('user/changepassword' , async (args , thunkAPI)=>{
    const {rejectWithValue} = thunkAPI
    try{
        const response = await axios.post(`${BASE_URL}/password/change/${args.id}` , args.data , {
            headers :{
                Authorization : `Bearer ${args.token}` , 
                'Content-Type': 'application/json',
            }
        })
    }catch(error){
        return rejectWithValue(error.message)
    }
})

// For Get Profile Data
export const getUserProfileAPi = createAsyncThunk('user/profile' , async (args , thunkAPI) =>{
    const {rejectWithValue} = thunkAPI
    try{
        const response = await axios.get(`${BASE_URL}/myProfile/${args.id}` , {
            headers :{
                Authorization : `Bearer ${args.token}` , 
                'Content-Type': 'application/json',
            }
        })
        return response.data.student[0]
    }catch(error){

        return rejectWithValue(error.response)
    }
})

const initialState = {
    data : [] ,
    reservationData : [] , 
    load : false ,  // idle  | success | load
    error : "",  // Auth || not-Auth  || error ,
    statusReservation  : StatusCode.IDLE  ,
    status : StatusCode.IDLE , 
    totalHistoryPage : null
}

const UserSlice = createSlice({
    name : "user" , 
    initialState , 
    reducers : {

    } ,
    extraReducers : (builder)=>{
        // Get User Profile
        builder.addCase(getUserProfileAPi.fulfilled , (state , action)=>{
            state.data = action.payload ; 
            state.load = false; 
        })
        builder.addCase(getUserProfileAPi.rejected , (state , action)=>{
            state.load = false
        })
        builder.addCase(getUserProfileAPi.pending , (state ,action)=>{
            state.load = true
        })
        // Forget Password
        builder.addCase(changePasswordAPI.fulfilled , (state , action)=>{
            toast.success("تم تغير كلمة السر بنجاح")
        }) 
        builder.addCase(changePasswordAPI.pending , (state , action)=>{
        })
        builder.addCase(changePasswordAPI.rejected , (state , action)=>{
            toast.error('كلمة المرور القديمة غير صحيحة برجاء المحاولة مرة اخي')
        })  
        // For Upload Profile Picture
        builder.addCase(updateProfilePicAPI.fulfilled , (state , action)=>{
            console.log("Photo Upload Successfully") ; 
            toast.success('تم تغير صورة البروفيل بنجاح')
        })
        builder.addCase(updateProfilePicAPI.pending , (state , action)=>{
            
        })
        builder.addCase(updateProfilePicAPI.rejected , (state , action)=>{
            toast.error("حدث خطا اثناء رفع الصورة برجاء اعادة المحاولة")
        })
        // For Get Reservation List 
        builder.addCase(getUserReservationAPI.fulfilled , (state , action)=>{
            state.reservationData = action.payload.results ;  
            state.statusReservation = StatusCode.SUCCESS ; 
            state.totalHistoryPage = action.payload.totalPages
        })
        builder.addCase(getUserReservationAPI.pending , (state ,action)=>{
            state.statusReservation = StatusCode.LOADING ;
        })
        builder.addCase(getUserReservationAPI.rejected , (state ,action)=>{
            if(403 === action.payload.response.status){
                state.statusReservation = StatusCode.UNAUTHORIZED ; 
            }else{
                toast.error(`حدث خطا برجاء اعادة المحاولة`)
            state.statusReservation = StatusCode.ERROR
            }
        })
        // For Delete Reservation
        builder.addCase(deleteReservationAPI.fulfilled , (state ,action)=>{
            state.status = StatusCode.SUCCESS ;
            console.log(state.reservationData) ;
            if(state.reservationData.length !==0 ){
            state.reservationData =  state.reservationData.filter((item)=>{
                return item.medicEx_id !== action.payload 
            })
            }
            toast.success('تم مسح الكشف بنجاح')
        })
        builder.addCase(deleteReservationAPI.rejected , (state ,action)=>{
            state.status = StatusCode.UNAUTHORIZED ;
        })

        // For Update User Data
        builder.addCase(updateProfileAPI.fulfilled , (state , action)=>{
            toast.success('تم تعديل البينات بنجاح')
        })

    }
})



export const getUserProfile = state => state.UserSlice.data

export const getUserReservationList = state => state.UserSlice.reservationData ;

export const getTotalHistoryPage = state => state.UserSlice.totalHistoryPage


export default UserSlice.reducer