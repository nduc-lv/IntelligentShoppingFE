// slices/dataSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface dataState {
  categorys: any,
  units: any,
  foods: any, }


const initialState: dataState = {
  categorys: [],
  units: [],
  foods: []
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<any>) => {
      state.categorys = action.payload;
    },
    setUnit: (state, action: PayloadAction<any>) => {
      state.units = action.payload;
    },
    setFood: (state, action: PayloadAction<any>) => {
      state.foods = action.payload;
    }
  },
  extraReducers: (builder) => {

  }
});


export const dataReducer = dataSlice.reducer;
export const { setCategory, setUnit, setFood } = dataSlice.actions;