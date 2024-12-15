import {Outlet} from "react-router-dom"
import content from "./Content.module.less"
import type {FC, ReactElement} from "react"

const Content: FC = (): ReactElement => {
    return (
        <div className={content.contentBox}>
            <Outlet/>
        </div>
    )
}

export default Content