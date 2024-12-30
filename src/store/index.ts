import {configureStore} from "@reduxjs/toolkit";
import bookKeepingSlice from "./slice/bookKeepingSlice.ts";
import UserSlice from "./slice/UserSlice.ts";
import TopicSlice from "./slice/topicSlice.ts";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
    reducer: {
        "bookKeeping": bookKeepingSlice,
        "user": UserSlice,
        "topic": TopicSlice,
    }
});

export default store;