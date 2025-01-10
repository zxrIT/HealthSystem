import contentDayBook from "./ContentDayBook.module.less"
import PieChartHealth from "../../../echartsComponent/pieChart/PieChart.tsx";
import {FC, ReactElement} from "react"
import FunnelChart from "../../../echartsComponent/funnelChart/FunnelChart.tsx";
import BarChart from "../../../echartsComponent/barChart/BarChart.tsx";

const ContentDayBook: FC = (): ReactElement => {
    return (
        <div className={contentDayBook.chargeUpBox}>
            <div className={contentDayBook.leftBox}>
                <div className={contentDayBook.leftTop}>
                    <PieChartHealth/>
                </div>
                <div className={contentDayBook.leftBottom}>
                    <FunnelChart/>
                </div>
            </div>
            <div className={contentDayBook.rightBox}>
                <BarChart/>
            </div>
        </div>
    )
}

export default ContentDayBook;