/*
 * @Description: 未添加描述
 * @Date: 2021-03-27 00:51:58
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-29 23:51:25
 */
// /*
//  * @Description: 未添加描述
//  * @Date: 2021-03-27 00:51:58
//  * @LastEditors: JackyChou
//  * @LastEditTime: 2021-03-28 17:52:58
//  */
import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import services from '@/services';
import DriverCarpoolInfo from './components/DriverCarpoolInfo';
import type { Orders, uinacarinfo, carFriendProps } from '../CarPoolHome';
import type { ColumnsType } from 'antd/lib/table';

const Driver = () => {
  const [orderGroup, setOrderGroup] = useState<Orders>(); // 拼车单
  const [userData, setUserData] = useState<uinacarinfo[]>(); // 每一个拼车单的人
  const [poolingInfo, setPoolingInfo] = useState<carFriendProps>();
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false); // 详情抽屉

  // 表格columns
  const columns: ColumnsType<any> = [
    {
      align: 'center',
      width: 30,
      title: '头像',
      dataIndex: 'nickname',
      render(text, recode) {
        return (
          <Fragment>
            <img src={recode.chathead} alt="" style={{ borderRadius: '5px' }} />
          </Fragment>
        );
      },
    },
    {
      align: 'center',
      width: 100,
      title: '性别',
      dataIndex: 'gender',
      render(text) {
        return text === 1 ? '男' : '女';
      },
    },
    {
      align: 'center',
      width: 200,
      title: '加入时间',
      dataIndex: 'jointime',
      render(text) {
        return moment(text).format('YYYY年MM月DD日 HH:mm');
      },
    },
    {
      title: '信誉',
      dataIndex: 'credibility',
    },

    {
      title: '留言',
      dataIndex: 'incarmsg',
    },
  ];
  // 查找某一个拼车信息
  const findDetailCarFriend = (params: number) => {
    services(`/findDetailCarFriend/${params}`).then((res) => {
      console.log(`res`, res);
      setUserData(res.data);
      setPoolingInfo(res.msg);
    });
  };
  useEffect(() => {
    services(`/getDriverCar`).then((params) => {
      console.log(`拼车司机`, params);
    });
  }, []);

  useEffect(() => {
    services('/findAllCarFriend').then((res) => {
      setOrderGroup(res.data);
    });
  }, []);

  return (
    <Fragment>
      {/* 拼车首页 */}
      <Row style={{ marginTop: '30px' }} wrap={true}>
        {orderGroup?.map((item, index) => {
          return (
            <Col key={index.toString()} style={{ margin: '1%' }}>
              <Card
                title={`${item.readyplace} -> ${item.goplace}`}
                hoverable={true}
                style={{ maxWidth: '600px' }}
                actions={[
                  <div>余座（{item.getnum}）</div>,
                  <div>价格（{item.aboutpay}）元</div>,
                  <Button
                    key="ellipsis"
                    disabled={false}
                    onClick={() => {
                      findDetailCarFriend(item.poolingcarid);
                      setIsShowDrawer(!isShowDrawer);
                      console.log(`查看详情`);
                    }}
                  >
                    查看详情
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={`出发时间:  ${moment(item.readtime).format('YYYY/MM/DD HH:mm')} ~ ${moment(item.gotime).format(
                    'YYYY/MM/DD HH:mm',
                  )}`}
                />
                <Card.Meta
                  title={`发布时间:  ${moment(item.starttime).format('YYYY/MM/DD HH:mm')}`}
                  style={{ marginTop: '12px' }}
                />
                <Card.Meta title={`${moment(item.starttime).fromNow()}发布`} style={{ textAlign: 'right' }} />
              </Card>
            </Col>
          );
        })}
      </Row>
      {/* 查看详情 */}
      <DriverCarpoolInfo
        isShowDrawer={isShowDrawer}
        setIsShowDrawer={setIsShowDrawer}
        poolingInfo={poolingInfo!}
        inUserColumns={columns}
        userData={userData!}
        placement={'right'}
      />
    </Fragment>
  );
};

export default Driver;
