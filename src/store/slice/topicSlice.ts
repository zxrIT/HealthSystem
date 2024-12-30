import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const topicSlice = createSlice({
    name: "topic",
    initialState: {topic: true, internationalization: false},
    reducers: {
        changeTopic: (state, action: PayloadAction<boolean>) => {
            state.topic = action.payload;
        },
        changeInternationalization: (state, action: PayloadAction<boolean>) => {
            state.internationalization = action.payload;
        }
    }
})

export const {changeTopic, changeInternationalization} = topicSlice.actions;
export default topicSlice.reducer;