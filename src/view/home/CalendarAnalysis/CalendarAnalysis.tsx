import type {FC, ReactElement} from "react"
import calenderStyle from "./CalendarAnalysis.module.less";
import {Calendar, type CalendarProps, ConfigProvider, theme} from "antd";
import type {Dayjs} from "dayjs";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const CalendarAnalysis: FC = (): ReactElement => {
    const topicSlice = useSelector((state: RootState) => state.topic);
    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };
    return (
        <ConfigProvider theme={{
            algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
            <div className={calenderStyle.calenderBox}>
                <Calendar showWeek={true} onPanelChange={onPanelChange}/>
            </div>
        </ConfigProvider>
    )
}

export default CalendarAnalysis