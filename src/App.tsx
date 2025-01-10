import React from 'react';
import {Fragment} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import WithAuthenticationHocComponent from "./HOC/WithAuthenticationHocComponent.tsx";
import Loading from "./error/loading/Loading.tsx";

const HealthIndex = React.lazy(() => import("./view/home/HealthIndex"));
const Login = React.lazy(() => import("./view/login/Login"));
const ContentDayBook = React.lazy(() => import("./view/home/contentDayBook/ContentDayBook"));
const ContentChargeUp = React.lazy(() => import("./view/home/contentChargeUp/ContentChargeUp"));
const MyInformation = React.lazy(() => import("./view/home/MyInformation/MyInformation"));
const AnnualAccountAnalysis = React.lazy(() => import("./view/home/AnnualAccountAnalysis/AnnualAccountAnalysis"));
const CalendarAnalysis = React.lazy(() => import("./view/home/CalendarAnalysis/CalendarAnalysis"));
const Forbidden = React.lazy(() => import("./error/403"));
const ServerError = React.lazy(() => import("./error/500"));

function App() {
    return (
        <Fragment>
            <BrowserRouter>
                <WithAuthenticationHocComponent>
                    <React.Suspense fallback={<Loading/>}>
                        <Routes>
                            <Route path="/home" element={<HealthIndex/>}>
                                <Route path="/home/" element={<ContentChargeUp/>}/>
                                <Route path="/home/dayBook" element={<ContentDayBook/>}/>
                                <Route path="/home/myInformation" element={<MyInformation/>}/>
                                <Route path="/home/AnnualAccountAnalysis" element={<AnnualAccountAnalysis/>}/>
                                <Route path="/home/CalendarAnalysis" element={<CalendarAnalysis/>}/>
                            </Route>
                            <Route path="/403" element={<Forbidden/>}/>
                            <Route path="/500" element={<ServerError/>}/>
                            <Route path="/" element={<Login/>}/>
                            <Route path="*" element={<Navigate to="/login"/>}/>
                        </Routes>
                    </React.Suspense>
                </WithAuthenticationHocComponent>
            </BrowserRouter>
        </Fragment>
    )
}

export default App
