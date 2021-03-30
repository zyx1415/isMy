/*
 * @Description: 未添加描述
 * @Date: 2021-03-29 23:37:44
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-31 01:53:37
 */
import services from '@/services';
import React, { Fragment, useEffect, useState } from 'react';
import type { carFriendProps, uinacarinfo } from '@/pages/CarPoolHome';
import { columns } from '@/pages/CarPoolHome';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Button, Table, Popconfirm, Modal, Card, message } from 'antd';
import { SwapRightOutlined, BellOutlined } from '@ant-design/icons';

type DriverProps = {
  vieid: number;
  driverid: number;
  poolingcarid: number;
  totalpay?: number;
  vietime: number;
  viemsg?: string;
  viestatus: number;
};

const DriverOrder = () => {
  const [driverOrderData, setDriverOrderData] = useState<DriverProps>(); // 所有单子信息
  const [carFriend, setCarFriend] = useState<carFriendProps>();
  const [userCarInfo, setUserCarInfo] = useState<uinacarinfo[]>();
  const [isShowInfo, setIsShowInfo] = useState(false);

  const findOne = (text: string) => {
    services(`/findDetailCarFriend/${text}`).then((params) => {
      setCarFriend(params.msg);
      setUserCarInfo(params.data);
    });
  };
  console.log(`carFriend`, carFriend);

  const interrupt = (value: string) => {
    services(`/quitPull/${value}`).then((params) => {
      console.log(`params`, params);
      services(`/findAllPull`).then((res) => {
        console.log(`params所有载客`, res);
        setDriverOrderData(res.data);
      });
    });
  };
  const modelClick = () => {
    setIsShowInfo(!isShowInfo);
  };

  const carColumns: ColumnsType<any> = [
    {
      align: 'center',
      // width: 100,
      title: '拼车单号',
      dataIndex: 'poolingcarid',
      render(text) {
        return (
          <a
            onClick={() => {
              findOne(text);
              modelClick();
            }}
          >
            {text}
          </a>
        );
      },
    },
    {
      align: 'center',
      title: '抢单时间',
      dataIndex: 'vietime',
      render(text) {
        return moment(text).format('YYYY年MM月DD日 HH:mm');
      },
    },
    {
      align: 'center',
      title: '开价',
      dataIndex: 'totalpay',
    },
    {
      align: 'center',
      title: '留言',
      dataIndex: 'viemsg',
    },
    {
      align: 'center',
      title: '抢单进度',
      dataIndex: 'viestatus',
      render(text) {
        if (text === 0) return '竞价中';

        if (text === 1) return '竞价失败';

        if (text === 2) return '退出竞价';

        if (text === 3) return '抢单成功';
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      dataIndex: 'action',
      render: (text, recode) => {
        return recode.viestatus === 0 ? (
          <Popconfirm
            title="您确定吗？ "
            onConfirm={() => {
              interrupt(recode.vieid);
              message.success('操作成功');
            }}
          >
            <Button
              type="primary"
              size="large"
              onClick={() => {
                console.log(`recode`, recode);
              }}
            >
              停止竞价
            </Button>
          </Popconfirm>
        ) : (
          '暂无操作'
        );
      },
    },
  ];

  const findAllPull = () => {
    services(`/findAllPull`).then((params) => {
      console.log(`params所有载客`, params);
      setDriverOrderData(params.data);
    });
  };
  useEffect(() => {
    findAllPull();
  }, [driverOrderData]);
  return (
    <Fragment>
      <Table columns={carColumns} rowKey="poolingcarid" dataSource={driverOrderData} pagination={false}></Table>
      <Modal
        visible={isShowInfo}
        width="80%"
        onOk={() => {
          modelClick();
        }}
        onCancel={() => {
          modelClick();
        }}
      >
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1 style={{ color: 'blue', fontWeight: 'bold' }}>{carFriend?.readyplace}</h1>
            <SwapRightOutlined style={{ fontSize: '30px', margin: '0 5px' }} />
            <h1 style={{ color: 'blue', fontWeight: 'bold' }}>{carFriend?.goplace}</h1>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p>
              出发时间段： {moment(carFriend?.readtime).format('YYYY/MM/DD HH:mm')} ~{' '}
              {moment(carFriend?.gotime).format('YYYY/MM/DD HH:mm')}
            </p>
            <p>总人数：{carFriend?.totalnum}个</p>
            <p>余座：{carFriend?.getnum}个</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h3 style={{ marginRight: '10px' }}>
              发布时间:
              <span>{moment(carFriend?.starttime).format('YYYY/MM/DD HH:mm')}</span>
            </h3>
            <BellOutlined style={{ margin: '5px 5px', color: '#d63f3f' }} />
            <h3 style={{ color: '#d63f3f', fontWeight: 'bold' }}>{moment(carFriend?.starttime).fromNow()}发布</h3>
          </div>
        </Card>
        <Table columns={columns} rowKey="userid" dataSource={userCarInfo} pagination={false}></Table>
      </Modal>
    </Fragment>
  );
};

export default DriverOrder;
