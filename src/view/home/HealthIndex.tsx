import React from "react"
import healthIndex from "./HealthIndex.module.less"
import type {FC, ReactElement} from "react"
import LeftNavigate from "../../component/home/leftNav/LeftNavigate";
import Header from "../../component/home/header/Header";
import Content from "../../component/home/content/Content";

const HealthIndex: FC = (): ReactElement => {
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