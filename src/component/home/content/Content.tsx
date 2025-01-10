import {Outlet} from "react-router-dom"
import content from "./Content.module.less"
import type {FC, ReactElement} from "react"
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const Content: FC = (): ReactElement => {
    const topicSlice = useSelector((state: RootState) => state.topic);
    return (
        <div className={topicSlice.topic ? content.contentBox : content.contentBoxDark}>
            <Outlet/>
        </div>
    )
}

export default Content