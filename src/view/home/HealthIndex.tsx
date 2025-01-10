import healthIndex from "./HealthIndex.module.less"
import {FC, Fragment, ReactElement, useEffect, useState} from "react"
import LeftNavigate from "../../component/home/leftNav/LeftNavigate";
import Header from "../../component/home/header/Header";
import Content from "../../component/home/content/Content";
import {useLocalStorage} from "../../hooks/useLocalStorage.ts";
import {IUser} from "../../typing/user/user.ts";
import {useDispatch, useSelector} from "react-redux";
import {initUser} from "../../store/slice/UserSlice.ts";
import Config from "../../component/home/config/Config.tsx";
import {CSSTransition} from "react-transition-group";
import {RootState} from "../../store";
import "../../transition/transition.less"
import {Location, useLocation} from "react-router-dom";

const HealthIndex: FC = (): ReactElement => {
    const [transitionStatus, setTransitionStatus] = useState<boolean>(false);
    const location: Location = useLocation();
    const dispatch = useDispatch();
    const topicSlice = useSelector((state: RootState) => state.topic);
    useEffect(() => {
        setTransitionStatus(!transitionStatus);
    }, [topicSlice.internationalization, topicSlice.topic]);

    useEffect(() => {
        const {getStorage} = useLocalStorage()
        const user: IUser = JSON.parse(getStorage("user"))
        dispatch(initUser(user))
    }, []);
    return (
        <CSSTransition in={transitionStatus} classNames="topic" timeout={1000}>
            <div className={topicSlice.topic ? healthIndex.home : healthIndex.homeDark}>
                <div className={healthIndex.left}>
                    <LeftNavigate/>
                </div>
                <div className={healthIndex.content}>
                    <Config/>
                    <Fragment>
                        {location.pathname === "/home/CalendarAnalysis" ? <></> : <Header/>}
                    </Fragment>
                    <Content/>
                </div>
            </div>
        </CSSTransition>
    )
}

export default HealthIndex