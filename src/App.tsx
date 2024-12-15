import {Fragment} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import HealthIndex from "./view/home/HealthIndex";
import Login from "./view/login/Login";
import ContentChargeUp from "./view/home/contentChargeUp/ContentChargeUp";
import ContentDayBook from "./view/home/contentDayBook/ContentDayBook";

function App() {
    return (
        <Fragment>
            <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<HealthIndex/>}>
                        <Route path="/home/" element={<ContentChargeUp/>}/>
                        <Route path="/home/dayBook" element={<ContentDayBook/>}/>
                    </Route>
                    <Route path="/" element={<Login/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </BrowserRouter>
        </Fragment>
    )
}

export default App
