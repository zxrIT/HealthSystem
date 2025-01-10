import type {FC, ReactElement} from "react"
import classStyle from "./AnnualAccountAnalysis.module.less"
import YearsDatasetChart from "../../../echartsComponent/YearsDataset/YearsDatasetChart.tsx";

const AnnualAccountAnalysis: FC = (): ReactElement => {
    return (
        <div className={classStyle.AnnualAccountAnalysisBox}>
            <YearsDatasetChart/>
        </div>
    )
}

export default AnnualAccountAnalysis