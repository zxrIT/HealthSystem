import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const bookKeepingSlice = createSlice({
    name: "bookKeeping",
    initialState: {tableReRenderStatus: false},
    reducers: {
        changeTableReRenderStatus: (state, action: PayloadAction<boolean>) => {
            state.tableReRenderStatus = action.payload;
        }
    }
});

export const {changeTableReRenderStatus} = bookKeepingSlice.actions;

export default bookKeepingSlice.reducer;