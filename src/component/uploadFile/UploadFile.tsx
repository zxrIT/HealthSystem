import {FC, ReactElement, useEffect, useState} from "react"
import classStyle from "./UploadFile.module.less"
import {Avatar, Button, Divider, List, Skeleton, Tooltip} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

interface DataType {
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    email: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    nat: string;
}

const UploadFile: FC = (): ReactElement => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic)

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadMoreData();
    }, []);

    return (
        <div className={classStyle.UploadFileBox}>
            <Tooltip title={t("Uploaded files")}>
                <div
                    id="scrollableDiv"
                    style={{
                        width: 500,
                        height: 200,
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                >
                    <InfiniteScroll
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={data.length < 50}
                        loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                        endMessage={<Divider plain>{t("It is all, nothing more")} 🤐</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item key={item.email}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.picture.large}/>}
                                        title={<a href="javascript:">{item.name.last}</a>}
                                        description={item.email}
                                    />
                                    <div>
                                        <Button type="primary">{t("Download")}</Button>
                                        <Button type="primary" danger
                                                style={{marginLeft: 10}}>{t("delete")}</Button>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>
            </Tooltip>
        </div>
    )
}

export default UploadFile