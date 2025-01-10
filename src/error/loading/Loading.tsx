import {FC, ReactElement, useEffect} from "react"
import classStyle from "./Loading.module.less"
import {Flex, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const Loading: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])
    return (
        <div className={classStyle.loadingBox}>
            <Flex gap="middle" vertical>
                <Flex gap="middle">
                    <Spin tip="Loading" size="large">
                        {t("loading")}
                    </Spin>
                </Flex>
            </Flex>
        </div>
    )
}

export default Loading