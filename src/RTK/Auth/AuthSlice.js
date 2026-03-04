import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import { toast } from "react-toastify";


export const singupAPI =createAsyncThunk('auth/signup' , async (args , thunkAPI)=>{
    console.log(`the args`)
    console.log(args)
    const {rejectWithValue} = thunkAPI
    try{
        const response = await axios.post(`${BASE_URL}/auth/signup` , args.data)
        console.log(response.data)
    }catch(error){
        return rejectWithValue(error.message)
    }
})

export const loginHandlerAPI = createAsyncThunk('auth/login' , async (args , thunkAPI )=>{
    const {rejectWithValue} = thunkAPI
    try {
        const response = await axios.post(`${BASE_URL}/auth/login` , args.userData , {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            }
        })
      return response.data
    } catch (error) {
      console.log( error.response);
      return rejectWithValue(error.response)
    }
})

const initialState = {
    user : localStorage.getItem('auth') ? JSON.parse(localStorage.getItem("auth")) : null  , 
    load : false , 
    
}

const AuthSlice = createSlice({
    name : "auth" , 
    initialState , 
    reducers : {
        logout : (state , action)=>{
            state.user = null ; 
            localStorage.removeItem("auth")
        }
    } , 
    extraReducers : (builder)=>{
        // For Login
        builder.addCase(loginHandlerAPI.fulfilled , (state ,action)=>{
                toast.success('تم تسجيل الدخول بنجاح')
                state.user = action.payload ;
                localStorage.setItem("auth" , JSON.stringify(action.payload)) ; 
                state.load = false ; 

        }) 
        builder.addCase(loginHandlerAPI.rejected , (state , action)=>{
            toast.error('كلمة المرور او الايميل غير صحيح')
            state.load = false
            
        })
        builder.addCase(loginHandlerAPI.pending , (state ,action)=>{
            state.load = true ; 
        })
        // For Sign up
        builder.addCase(singupAPI.fulfilled , (state ,action)=>{
            toast.success("برجاء مرجعة الايميل الجامعي لتفعيل حسابك")
        }) 
        builder.addCase(singupAPI.pending , (state ,action)=>{
        }) 
        builder.addCase(singupAPI.rejected , (state ,action)=>{
            toast.error('حدث خطاء اثناء انشاء الحساب برجاء التاكد من الايميل ثم اعادة المحاولة')
        }) 
    }
})


export const loginLoad = state => state.AuthSlice.load ; 
export const getUserInfo = state=> state.AuthSlice.user ;
export const getToken = state => state.AuthSlice.user.token

export default AuthSlice.reducer
export const {logout} = AuthSlice.actions ; 

