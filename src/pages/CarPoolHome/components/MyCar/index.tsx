/*
 * @Description: 未添加描述
 * @Date: 2021-03-09 09:28:57
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-28 15:01:40
 */
import type { FC, SetStateAction, Dispatch } from 'react';
import React, { useState, useEffect } from 'react';
import { List, Button, Drawer } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { SwapRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';

import type { carFriendProps, uinacarinfo } from '@/pages/CarPoolHome';
import CarpoolInfo from '../CarpoolInfo';
import services from '@/services';

interface setIsShowMyCarProps {
  isShowMyCar: boolean;
  setIsShowMyCar: Dispatch<SetStateAction<boolean>>;
  inUserColumns: ColumnsType<any>;
  isCarAction: boolean;
  // isShowDrawer: boolean;
  // setIsShowDrawer: Dispatch<SetStateAction<boolean>>;
}
// isShowMyCar:boolean,setIsShowMyCar:React.Dispatch<React.SetStateAction<boolean>>
const MyCar: FC<setIsShowMyCarProps> = (props) => {
  const { isShowMyCar, setIsShowMyCar, inUserColumns, isCarAction } = props;
  const [isShowMyHistory, setIsShowMyHistory] = useState<boolean>(false); // 我的历史记录抽屉
  const [myCarData, setMyCarData] = useState<carFriendProps[]>(); // 我的所有拼车
  const [historyData, setHistoryData] = useState<carFriendProps[]>(); // 我的拼车历史
  const [userData, setUserData] = useState<uinacarinfo[]>(); // 每一个拼车单的人
  const [poolingInfo, setPoolingInfo] = useState<carFriendProps>();
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false); // 从我的记录里打开的详细
  // 查找某一个拼车信息
  const findDetailCarFriend = (params: number) => {
    services(`/findDetailCarFriend/${params}`).then((res) => {
      console.log(`res`, res);
      setUserData(res.data);
      setPoolingInfo(res.msg);
    });
  };
  useEffect(() => {
    services('/findMyCarPooling').then((params) => {
      setMyCarData(params.data);
    });
  }, [isShowMyCar]);
  return (
    <Drawer
      title="我的拼车"
      visible={isShowMyCar}
      closable={false}
      placement="left"
      width="80%"
      onClose={() => {
        setIsShowMyCar(!isShowMyCar);
      }}
      footer={
        <Button
          size="large"
          type="primary"
          style={{ float: 'right' }}
          onClick={() => {
            setIsShowMyHistory(!isShowMyHistory);
            services(`/findHistoryCarPooling`).then((params) => {
              console.log(`查看历史`, params);
              setHistoryData(params.data);
            });
          }}
        >
          查看历史
        </Button>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={myCarData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <a
                  onClick={() => {
                    findDetailCarFriend(item.poolingcarid!);
                    setIsShowDrawer(!isShowDrawer);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3>{item?.readyplace}</h3>
                    <SwapRightOutlined style={{ fontSize: '30px', margin: '0 5px' }} />
                    <h3>{item?.goplace}</h3>
                  </div>
                </a>
              }
              description={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <p>
                    出发时间段： {moment(item?.readtime).format('YYYY/MM/DD HH:mm')} ~{' '}
                    {moment(item?.gotime).format('YYYY/MM/DD HH:mm')}
                  </p>
                </div>
              }
            />
            <p> 总人数：{item?.totalnum}个~~</p>
            <p> 余座：{item?.getnum}个</p>
          </List.Item>
        )}
      />
      {/* 我的拼车的详细信息drawer */}
      <CarpoolInfo
        isShowDrawer={isShowDrawer}
        setIsShowDrawer={setIsShowDrawer}
        poolingInfo={poolingInfo!}
        inUserColumns={inUserColumns}
        isCarAction={isCarAction!}
        userData={userData!}
        placement={'left'}
      />

      {/* 查看历史 */}
      <Drawer
        visible={isShowMyHistory}
        width="80%"
        closable={false}
        placement="left"
        title="拼车历史"
        onClose={() => {
          setIsShowMyHistory(!isShowMyHistory);
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={historyData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  // <a
                  //   onClick={() => {
                  //     findDetailCarFriend(item.poolingcarid!);
                  //     setIsShowDrawer(!isShowDrawer);
                  //   }}
                  // >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h3>{item?.readyplace}</h3>
                    <SwapRightOutlined style={{ fontSize: '30px', margin: '0 5px' }} />
                    <h3>{item?.goplace}</h3>
                  </div>
                  // </a>
                }
                description={
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>
                      出发时间段： {moment(item?.readtime).format('YYYY/MM/DD HH:mm')} ~{' '}
                      {moment(item?.gotime).format('YYYY/MM/DD HH:mm')}
                    </p>
                  </div>
                }
              />
              <p> 总人数：{item?.totalnum}个~~</p>
              <p> 余座：{item?.getnum}个</p>
            </List.Item>
          )}
        />
      </Drawer>
    </Drawer>
  );
};
export default MyCar;
