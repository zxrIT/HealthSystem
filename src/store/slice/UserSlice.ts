import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../../typing/user/user.ts";

const UserSlice = createSlice({
    name: "User",
    initialState: {user: {id: "", identityCard: "", mobile: "", token: "", username: ""}},
    reducers: {
        initUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        }
    }
})

export const {initUser} = UserSlice.actions;
export default UserSlice.reducer;