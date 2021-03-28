/*
 * @Description: 未添加描述
 * @Date: 2021-03-18 15:12:33
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-27 00:57:24
 */
import type { FC, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import React, { Fragment } from 'react';
import { Card, Button, Drawer, Table, Form, Row, Col, Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {
  SwapRightOutlined,
  BellOutlined,
  QqOutlined,
  WechatOutlined,
  MobileOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { carFriendProps, uinacarinfo } from '@/pages/CarPoolHome';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from '../../index.less';
import services from '@/services';

// 详细拼车抽屉需要的属性
export interface CarpoolInfoProps {
  isShowDrawer: boolean;
  setIsShowDrawer: Dispatch<SetStateAction<boolean>>;
  poolingInfo: carFriendProps;
  inUserColumns: ColumnsType<any>;
  isCarAction?: boolean;
  userData: uinacarinfo[];
  placement: 'top' | 'right' | 'bottom' | 'left' | undefined;
}

const CarpoolInfo: FC<CarpoolInfoProps> = (props) => {
  const { isShowDrawer, setIsShowDrawer, poolingInfo, inUserColumns, userData, placement, isCarAction } = props;
  // const [userApplyInfo, setUserApplyInfo] = useState<uinacarinfo>();
  const [isShowApply, setIsShowApply] = useState<boolean>(false); // 申请信息Drawer
  const [defaultText, setDefaultText] = useState<string>(''); // 留言
  const [form] = Form.useForm();
  // console.log(`userData`, userData);
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = (params: any) => {
    services(
      `/joinCarFriend?poolingcarid=${poolingInfo.poolingcarid}&incarmsg=${
        params.inCarMsg ? params.inCarMsg : ''
      }&qqnum=${params.qqnum ? params.qqnum : ''}&wxnum=${params.wxnum ? params.wxnum : ''}&phone=${
        params.phone ? params.phone : ''
      }&email=${params.email ? params.email : ''}`,
      { method: 'post' },
    ).then((params) => {
      console.log(`params来了`, params);
      onReset();
      setIsShowApply(!isShowApply);
    });
  };

  return (
    <Fragment>
      <Drawer
        closable={false}
        placement={placement}
        title="拼车信息"
        visible={isShowDrawer}
        width={'80%'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              style={{ width: '30%', minWidth: '50px' }}
              type="primary"
              size="large"
              onClick={() => {
                // setDefaultText('');
                setIsShowDrawer(!isShowDrawer);
              }}
            >
              返回
            </Button>
            {isCarAction ? (
              <Button style={{ width: '30%', minWidth: '50px' }} type="primary" size="large" onClick={() => {}}>
                申请退出
              </Button>
            ) : (
              <Button
                style={{ width: '30%', minWidth: '50px' }}
                type="primary"
                size="large"
                onClick={() => {
                  setIsShowApply(!isShowApply);
                }}
              >
                加入拼车
              </Button>
            )}
          </div>
        }
        onClose={() => {
          setIsShowDrawer(!isShowDrawer);
        }}
      >
        <div className={styles.drawer_box}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h1 style={{ color: 'blue', fontWeight: 'bold' }}>{poolingInfo?.readyplace}</h1>
              <SwapRightOutlined style={{ fontSize: '30px', margin: '0 5px' }} />
              <h1 style={{ color: 'blue', fontWeight: 'bold' }}>{poolingInfo?.goplace}</h1>
            </div>
            <p>
              出发时间段： {moment(poolingInfo?.readtime).format('YYYY/MM/DD HH:mm')} ~{' '}
              {moment(poolingInfo?.gotime).format('YYYY/MM/DD HH:mm')}
            </p>
            <p>总人数：{poolingInfo?.totalnum}个</p>
            <p>余座：{poolingInfo?.getnum}个</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h3 style={{ marginRight: '10px' }}>
                发布时间:
                <span>{moment(poolingInfo?.starttime).format('YYYY/MM/DD HH:mm')}</span>
              </h3>
              <BellOutlined style={{ margin: '5px 5px', color: '#d63f3f' }} />
              <h3 style={{ color: '#d63f3f', fontWeight: 'bold' }}>{moment(poolingInfo?.starttime).fromNow()}发布</h3>
            </div>
          </Card>
          <Table columns={inUserColumns} rowKey="userid" dataSource={userData} pagination={false}></Table>
        </div>

        {/* 申请加入拼车表单 */}
        <Drawer
          title="我要加入"
          visible={isShowApply}
          closable={false}
          width="80%"
          onClose={() => {
            setIsShowApply(!isShowApply);
          }}
        >
          <Form form={form} onFinish={onFinish}>
            <Row justify="center">
              <Col style={{ padding: '10px 0', color: 'red' }}>
                <span>仅有组队成员可以查看下面的信息 其他人不可见</span>
              </Col>
            </Row>
            <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
              <Col span={12}>
                <Form.Item name="qqnum">
                  <Input
                    prefix={<QqOutlined style={{ fontSize: '24px', color: '#5dd8d8' }} />}
                    placeholder="我的qq号"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
              <Col span={12}>
                <Form.Item name="wxnum">
                  <Input
                    prefix={<WechatOutlined style={{ fontSize: '24px', color: '#39d662' }} />}
                    placeholder="我的微信号"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
              <Col span={12}>
                <Form.Item name="phone">
                  <Input
                    prefix={<MobileOutlined style={{ fontSize: '24px', color: '#5a4f69' }} />}
                    placeholder="我的手机号"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
              <Col span={12}>
                <Form.Item name="email">
                  <Input
                    prefix={<MobileOutlined style={{ fontSize: '24px', color: '#5a4f69' }} />}
                    placeholder="我的邮箱号"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
              <Col span={12}>
                <Form.Item>
                  <Input
                    disabled={true}
                    prefix={<AppstoreOutlined style={{ fontSize: '24px' }} />}
                    placeholder="暂不支持其他联系方式哦"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={12}>
                <Form.Item name="inCarMsg">
                  <Input.TextArea
                    style={{ width: '100%' }}
                    allowClear={true}
                    key="text_area"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    value={defaultText}
                    onChange={(params) => {
                      setDefaultText(params.target.value);
                    }}
                    placeholder="拼车留言，让他们更懂你  【PS】为了您的安全，禁止留联系方式 "
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={6}>
                <Form.Item>
                  <Button htmlType="submit" type="primary" size="large" style={{ width: '100%' }}>
                    提交
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Button htmlType="button" type="default" size="large" onClick={onReset} style={{ width: '100%' }}>
                    重置
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </Drawer>
    </Fragment>
  );
};

export default CarpoolInfo;
