import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../API_Route/GlobalRoute";
import StatusCode from "../../StatusCode.js";



export const getAllLevelsAPI = createAsyncThunk('level/getall', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.get(`${BASE_URL}/sysdata/levels`)
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const deleteLevelsAPI = createAsyncThunk('level/delete', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
        const { data } = await axios.delete(`${BASE_URL}/sysdata/levels/${args.data}`, {
            headers: {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});


export const addNewLevelsAPI = createAsyncThunk('level/add', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.post(`${BASE_URL}/sysdata/levels`, args.data, {
            headers: {
                Authorization: `Bearer ${args.token}`,
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const updateLevelsAPI = createAsyncThunk('level/update', async (args, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const { data } = await axios.put(`${BASE_URL}/sysdata/levels/${args.data.id}`, args.data, {
            headers: {
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

const LevelSlice = createSlice({
    name: "level",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        //* For Get All Levels
        builder.addCase(getAllLevelsAPI.fulfilled, (state, action) => {
            state.data = action.payload;

            state.status = StatusCode.IDLE
        })
        builder.addCase(getAllLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //! For Delete Level
        builder.addCase(deleteLevelsAPI.fulfilled, (state, action) => {
            state.data = state.data.filter(item => item.level_id !== action.payload.level_id)
            state.status = StatusCode.IDLE
        })
        builder.addCase(deleteLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //? For Add Level
        builder.addCase(addNewLevelsAPI.fulfilled, (state, action) => {
            state.data.push(action.payload)
            state.status = StatusCode.IDLE
        })
        builder.addCase(addNewLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //? For Update Level
        builder.addCase(updateLevelsAPI.fulfilled, (state, action) => {
            const index = state.data.findIndex(item => item.level_id === action.payload.level_id)
            state.data[index] = action.payload
            state.status = StatusCode.IDLE
        })

        // builder.addCase(updateLevelsAPI.fulfilled, (state, action) => {
        //     console.log("Success");
        //     const updatedIndex = state.data.findIndex(item => item.level_id === action.payload.level_id);
        //     if (updatedIndex !== -1) {
        //       const newData = [...state.data]; // Create a shallow copy of the data array
        //       newData[updatedIndex] = action.payload; // Replace the updated item with the new data
        //       return {
        //         ...state,
        //         data: newData,
        //         status: StatusCode.IDLE
        //       };
        //     }
        //   });

        builder.addCase(updateLevelsAPI.pending, (state, action) => {
            console.log("Penddding")
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateLevelsAPI.rejected, (state, action) => {
            console.log("REJJjjjected", action.payload)
            state.status = StatusCode.ERROR
        })
    }
})


export default LevelSlice.reducer

export const getAllLevels = state => state.LevelSlice.data; 