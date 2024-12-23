// slices/dataSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface dataState {
    category: any;
    unit: any;
}

const initialState: dataState = {
    category: [],
    unit: []
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<any>) => {
            state.category = action.payload;
        },
        setUnit: (state, action: PayloadAction<any>) => {
            state.unit = action.payload;
        }
    },
    extraReducers: (builder) => {

    }
});


export const dataReducer = dataSlice.reducer;
