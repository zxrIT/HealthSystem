import healthIndex from "./HealthIndex.module.less"
import {FC, ReactElement, useEffect} from "react"
import LeftNavigate from "../../component/home/leftNav/LeftNavigate";
import Header from "../../component/home/header/Header";
import Content from "../../component/home/content/Content";
import {useLocalStorage} from "../../hooks/useLocalStorage.ts";
import {IUser} from "../../typing/user/user.ts";
import {useDispatch} from "react-redux";
import {initUser} from "../../store/slice/UserSlice.ts";

const HealthIndex: FC = (): ReactElement => {
    const dispatch = useDispatch();
    useEffect(() => {
        const {getStorage} = useLocalStorage()
        const user: IUser = JSON.parse(getStorage("user"))
        dispatch(initUser(user))
    }, []);
    return (
        <div className={healthIndex.home}>
            <div className={healthIndex.left}>
                <LeftNavigate/>
            </div>
            <div className={healthIndex.content}>
                <Header/>
                <Content/>
            </div>
        </div>
    )
}

export default HealthIndex