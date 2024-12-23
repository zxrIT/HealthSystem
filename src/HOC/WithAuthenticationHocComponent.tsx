import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import type {Location} from "react-router-dom";
import type {ReactElement} from "react";

const WithAuthenticationHocComponent = (props: { children: ReactElement }): ReactElement => {
    const {removeStorage} = useLocalStorage()
    const location: Location = useLocation()
    const navigateFunction: NavigateFunction = useNavigate();
    if (location.pathname === "/") {
        return props.children
    }
    return props.children
}

export default WithAuthenticationHocComponent