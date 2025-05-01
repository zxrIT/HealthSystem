import {FC, ReactElement, useEffect, useState} from "react"
import sunPng from "../../../assets/static/system/icon/sun.png"
import darkPng from "../../../assets/static/system/icon/night.png"
import classStyle from "./Config.module.less"
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import chinesePng from "../../../assets/static/system/icon/chinese.png";
import RealNameAuthenticationPng from "../../../assets/static/system/icon/Real-name-authentication.png"
import RealNameAuthenticationPngDark from "../../../assets/static/system/icon/Real-name-authentication-dark.png"
import RealNameAuthenticationPngSuccess from "../../../assets/static/system/icon/Real-name-authentication-success.png"
import GithubDarkPng from "../../../assets/static/system/icon/github-dark.png"
import englishPng from "../../../assets/static/system/icon/english.png";
import GithubPng from "../../../assets/static/system/icon/github.png";
import chineseDarkpng from "../../../assets/static/system/icon/chinese-dark.png";
import aiPng from "../../../assets/static/system/icon/ai.png"
import englishDarkPng from "../../../assets/static/system/icon/english-dark.png";
import {changeInternationalization, changeTopic} from "../../../store/slice/topicSlice.ts";
import mapImg from "../../../assets/static/system/icon/user.jpg";
import Regex from "../../../util/Regex.ts";
import {Tooltip} from "antd";
import {useLocalStorage} from "../../../hooks/useLocalStorage.ts";
import {type NavigateFunction, useNavigate} from "react-router-dom";
import {NavigateUrl} from "../../../typing/enum";

const Config: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const {setStorage} = useLocalStorage()
    const dispatch = useDispatch()
    const navigate: NavigateFunction = useNavigate()
    const topicSlice = useSelector((state: RootState) => state.topic);
    const user = useSelector((state: RootState) => state.user);
    const [realNameAuthenticationPngStatus, setRealNameAuthenticationPngStatus] = useState<boolean>(false);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    useEffect(() => {
        if (Regex.regexIdentityCard.test(user.user.identityCard) && Regex.regexMobile.test(user.user.mobile) && Regex.regexEmail.test(user.user.email)) {
            setRealNameAuthenticationPngStatus(true);
        }
    }, [user.user.identityCard, user.user.mobile]);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    return (
        <div className={topicSlice.topic ? classStyle.configBox : classStyle.configBoxDark}>
            <div className={classStyle.icon} style={{borderRadius: "50%"}} onClick={() => {
                navigate(NavigateUrl.ai)
            }}>
                <img style={{borderRadius: "50%"}}
                     src={aiPng} alt="ai"/>
            </div>
            <div className={classStyle.icon} onClick={() => {
                dispatch(changeTopic(!topicSlice.topic))
                setStorage("topic", JSON.stringify(!topicSlice.topic))
            }}>
                <img src={topicSlice.topic ? sunPng : darkPng} alt="Logo"/>
            </div>
            <div className={classStyle.icon} onClick={() => {
                dispatch(changeInternationalization(!topicSlice.internationalization))
                setStorage("internationalization", JSON.stringify(!topicSlice.internationalization))
            }}>
                <img src={topicSlice.topic ? (!topicSlice.internationalization ? chinesePng : englishPng)
                    : (!topicSlice.internationalization ? chineseDarkpng : englishDarkPng)} alt="Logo"/>
            </div>
            <Tooltip title={!realNameAuthenticationPngStatus ?
                t("You do not have real name authentication, click to authentication") :
                t("You have completed real-name authentication")}>
                <div className={classStyle.icon}>
                    <img
                        src={realNameAuthenticationPngStatus ? RealNameAuthenticationPngSuccess :
                            (topicSlice.topic ? RealNameAuthenticationPng : RealNameAuthenticationPngDark)}/>
                </div>
            </Tooltip>
            <Tooltip title={t("Go to View Project")}>
                <div className={classStyle.icon} style={{borderRadius: "50%"}} onClick={() => {
                    window.open(import.meta.env.VITE_GITHUB_URL, "_blank")
                }}>
                    <img style={{borderRadius: "50%"}}
                         src={topicSlice.topic ? GithubPng : GithubDarkPng} alt="github"/>
                </div>
            </Tooltip>
            <div className={classStyle.icon} style={{borderRadius: "50%"}}>
                <img style={{borderRadius: "50%"}}
                     src={user.user.imageUrl.length === 0 ? mapImg : user.user.imageUrl} alt="userPicture"/>
            </div>
        </div>
    )
}

export default Config