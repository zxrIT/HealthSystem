import {configureStore} from "@reduxjs/toolkit";
import bookKeepingSlice from "./slice/bookKeepingSlice.ts";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer: {
        "bookKeeping": bookKeepingSlice
    }
});
export default store;