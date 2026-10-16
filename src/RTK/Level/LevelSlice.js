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
            const rawList = Array.isArray(action.payload)
                ? action.payload
                : (action.payload?.value || []);
            state.data = rawList.map(item => ({
                ...item,
                id: item.id ?? item.level_id,
                level_id: item.level_id ?? item.id,
                levelName: item.levelName ?? item.level_name ?? '',
                level_name: item.level_name ?? item.levelName ?? ''
            }));
            state.status = StatusCode.IDLE;
        })
        builder.addCase(getAllLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(getAllLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //! For Delete Level
        builder.addCase(deleteLevelsAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.level_id ?? action.payload?.id ?? action.payload;
            state.data = state.data.filter(item => item.id !== targetId && item.level_id !== targetId);
            state.status = StatusCode.IDLE;
        })
        builder.addCase(deleteLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(deleteLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //? For Add Level
        builder.addCase(addNewLevelsAPI.fulfilled, (state, action) => {
            const item = action.payload;
            if (item) {
                state.data.push({
                    ...item,
                    id: item.id ?? item.level_id,
                    level_id: item.level_id ?? item.id,
                    levelName: item.levelName ?? item.level_name ?? '',
                    level_name: item.level_name ?? item.levelName ?? ''
                });
            }
            state.status = StatusCode.IDLE;
        })
        builder.addCase(addNewLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(addNewLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })

        //? For Update Level
        builder.addCase(updateLevelsAPI.fulfilled, (state, action) => {
            const targetId = action.payload?.id ?? action.payload?.level_id;
            const index = state.data.findIndex(item => item.id === targetId || item.level_id === targetId);
            if (index !== -1) {
                state.data[index] = {
                    ...state.data[index],
                    ...action.payload,
                    id: action.payload.id ?? action.payload.level_id ?? state.data[index].id,
                    level_id: action.payload.level_id ?? action.payload.id ?? state.data[index].level_id,
                    levelName: action.payload.levelName ?? action.payload.level_name ?? state.data[index].levelName,
                    level_name: action.payload.level_name ?? action.payload.levelName ?? state.data[index].level_name
                };
            }
            state.status = StatusCode.IDLE;
        })

        builder.addCase(updateLevelsAPI.pending, (state, action) => {
            state.status = StatusCode.LOADING
        })
        builder.addCase(updateLevelsAPI.rejected, (state, action) => {
            state.status = StatusCode.ERROR
        })
    }
})


export default LevelSlice.reducer

export const getAllLevels = state => state.LevelSlice.data; 