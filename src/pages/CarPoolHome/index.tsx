/*
 * @Description: 未添加描述
 * @Date: 2021-02-24 14:47:33
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-30 23:34:31
 */
import type { FC } from 'react';

import React, { Fragment, useState, useEffect } from 'react';
import { Card, Button, Row, Col, Input, Popconfirm, Form, message, Modal } from 'antd';
import { SwapRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Cookies from 'js-cookie';
import MyCar from './components/MyCar';
import MyCarpool from './components/MyCarpool';
import CarpoolInfo from './components/CarpoolInfo';
import styles from './index.less';
import services from '@/services';

// 拼车单信息
export type carFriendProps = {
  poolingcarid: number; // 拼车id，每一个拼车id唯一
  poolinguserid: number; // 发起人id
  userids?: string; //	加入拼车的id
  aboutpay?: number; //	大概路费
  totalnum: number; //	共需要人数
  getnum: number; //	需要人数
  starttime?: number; //	发起拼车的时间
  endtime?: number; //	结束拼车的时间
  readtime: number; //	最早出发的时间
  gotime: number; //	最晚出发的时间
  readyplace: string; //	出发地
  goplace: string; //	目的地
  poolinglimit?: number; //	拼车限制
  poolingstatus?: number; //	拼车状态
  leaveids?: string; //	退出，请出拼车的id
};
export type Orders = carFriendProps[];
// 拼车人信息
export type uinacarinfo = {
  poolingcarid: number; // 拼车id，每一个拼车id唯一
  userid: number; // 用户id，站内唯一键
  nickname: string; //	昵称
  chathead: string; // 用户头像
  gender: number; // 性别，0女、1男
  incarmsg?: string; //	拼车中的留言
  jointime: number; //	加入拼车时间
  endtime?: number; //	完结的时间
  instatus?: number; // 拼车状态
  outinfo: number; // 暴露的信息
  qqnum?: string; // QQ号
  wxnum?: string; //	微信号
  phone?: number; //	手机号
  email?: string; // 邮箱
};

// 表格columns
export const columns: ColumnsType<any> = [
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
const CarPoolHome: FC = () => {
  const [orderGroup, setOrderGroup] = useState<Orders>(); // 拼车单
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false); // 详情抽屉
  const [isShowMyCar, setIsShowMyCar] = useState<boolean>(false); // 我的订单抽屉
  const [isShowApply, setIsShowApply] = useState<boolean>(false); // 申请拼车抽屉
  // const [defaultText, setDefaultText] = useState<string>('');
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false); // 按钮loading
  const [userData, setUserData] = useState<uinacarinfo[]>(); // 每一个拼车单的人
  const [poolingInfo, setPoolingInfo] = useState<carFriendProps>();
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [lookUserInfo, setLookUserInfo] = useState<uinacarinfo>();
  const [isCarAction, setIsCarAction] = useState<boolean>();

  const inUserColumns: ColumnsType<any> = [
    ...columns,
    {
      title: '不与拼车',
      align: 'center',
      width: 200,
      dataIndex: 'action',
      render: (text, recode) => {
        return (
          <Popconfirm
            title="确认请出吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              services(`/letOut/${recode.poolingcarid}/${recode.userid}/这个人的人品不行`).then((params) => {
                console.log(`清楚`, params);
                if (params.state === 'error') message.error('当前人数过少，不能清出哦');
                // services(`/getCallOut/${recode.poolingcarid}`).then((asd) => {
                //   console.log(`asd`, asd);
                // });
              });
            }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="dashed" size="large">
              发起请出
            </Button>
          </Popconfirm>
        );
      },
    },
    {
      title: '联系',
      align: 'center',
      width: 200,
      dataIndex: 'contact',
      render: (text, recode) => {
        return (
          <Button
            type="primary"
            size="large"
            onClick={() => {
              console.log(`recode`, recode);
              setLookUserInfo(recode);
              setIsModalShow(!isModalShow);
            }}
          >
            现在联系
          </Button>
        );
      },
    },
  ];

  // 查找某一个拼车信息
  const findDetailCarFriend = (params: number) => {
    services(`/findDetailCarFriend/${params}`).then((res) => {
      console.log(`res`, res);
      setIsCarAction(res.action);
      setUserData(res.data);
      setPoolingInfo(res.msg);
    });
  };
  // 查询单
  const isShowData = (res: any) => {
    if (res.data.length > 0) setOrderGroup(res.data);
    else message.info('没有找到与您相同的哦');
  };

  const onFinish = (params: any) => {
    const { origin, destination } = params;
    setIsButtonLoading(!isButtonLoading);
    setTimeout(() => {
      setIsButtonLoading(false);
    }, 1000);
    if (origin && destination)
      services(`/findCarFriendByLikeTrip/${origin}/${destination}`).then((res) => isShowData(res));
    else if (origin) services(`/findCarFriendByLikeOrigin/${origin}`).then((res: any) => isShowData(res));
    else if (destination) services(`/findCarFriendByLikeBourn/${destination}`).then((res: any) => isShowData(res));
    else {
      message.info('您还么有输入任何信息哦');
      services('/findAllCarFriend').then((res) => {
        setOrderGroup(res.data);
      });
    }
  };
  // 根据drawer刷新
  useEffect(() => {
    services('/findAllCarFriend').then((res) => {
      setOrderGroup(res.data);
    });
  }, [isShowApply]);

  return (
    <Fragment>
      <div className={styles.title_box}>
        {Cookies.get('userData') ? (
          <Button
            type="primary"
            className={styles.title_box_button}
            onClick={() => {
              setIsShowMyCar(!isShowMyCar);
            }}
          >
            我的拼车
          </Button>
        ) : (
          <div></div>
        )}

        <Form onFinish={onFinish}>
          <Row justify="center">
            <Col span={10}>
              <Form.Item name="origin">
                <Input placeholder="出发地" allowClear={true} bordered={true} />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item>
                <SwapRightOutlined className={styles.title_box_item} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="destination">
                <Input placeholder="目的地" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item>
                <Button htmlType="submit" type="dashed" size="middle" loading={isButtonLoading}>
                  搜索
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {Cookies.get('userData') ? (
          <Button
            type="primary"
            className={styles.title_box_button}
            onClick={() => {
              setIsShowApply(!isShowApply);
            }}
          >
            我要拼车
          </Button>
        ) : (
          <div>登陆后才能拼车哦</div>
        )}
      </div>

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

      <Modal
        title="详细信息"
        visible={isModalShow}
        closable={false}
        centered={true}
        footer={false}
        zIndex={1001}
        onCancel={() => {
          setIsModalShow(!isModalShow);
        }}
      >
        <Row justify="center">
          <Col span={4}>手机</Col>
          <Col span={8} title="手机">
            {lookUserInfo?.phone}
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 5 }}>
          <Col span={4}>微信</Col>
          <Col span={8} title="微信">
            {lookUserInfo?.wxnum}
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 5 }}>
          <Col span={4}>邮箱</Col>
          <Col span={8} title="邮箱">
            {lookUserInfo?.email}
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 5 }}>
          <Col span={4}>留言</Col>
          <Col span={8} title="留言">
            {lookUserInfo?.incarmsg}
          </Col>
        </Row>
      </Modal>

      {/* 查看详情 */}
      <CarpoolInfo
        isShowDrawer={isShowDrawer}
        setIsShowDrawer={setIsShowDrawer}
        poolingInfo={poolingInfo!}
        inUserColumns={isCarAction ? inUserColumns : columns}
        isCarAction={isCarAction!}
        userData={userData!}
        placement={'right'}
      />

      {/* 申请拼车 */}
      <MyCar
        isShowMyCar={isShowMyCar}
        setIsShowMyCar={setIsShowMyCar}
        inUserColumns={inUserColumns}
        isCarAction={isCarAction!}
      />
      <MyCarpool isShowApply={isShowApply} setIsShowApply={setIsShowApply} />
    </Fragment>
  );
};
export default CarPoolHome;
