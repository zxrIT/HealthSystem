import {Fragment} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import HealthIndex from "./view/home/HealthIndex";
import Login from "./view/login/Login";
import ContentChargeUp from "./view/home/contentChargeUp/ContentChargeUp";
import ContentDayBook from "./view/home/contentDayBook/ContentDayBook";
import WithAuthenticationHocComponent from "./HOC/WithAuthenticationHocComponent.tsx";
import Forbidden from "./error/403";

function App() {
    return (
        <Fragment>
            <BrowserRouter>
                <WithAuthenticationHocComponent>
                    <Routes>
                        <Route path="/home" element={<HealthIndex/>}>
                            <Route path="/home/" element={<ContentChargeUp/>}/>
                            <Route path="/home/dayBook" element={<ContentDayBook/>}/>
                        </Route>
                        <Route path="/403" element={<Forbidden/>}/>
                        <Route path="/" element={<Login/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </WithAuthenticationHocComponent>
            </BrowserRouter>
        </Fragment>
    )
}

export default App
