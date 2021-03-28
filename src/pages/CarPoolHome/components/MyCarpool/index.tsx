/*
 * @Description: 未添加描述
 * @Date: 2021-03-09 12:27:59
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-26 23:20:05
 */
import type { FC, Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Button, Input, Drawer, Form, Select, Row, Col, DatePicker } from 'antd';
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  MobileOutlined,
  QqOutlined,
  WechatOutlined,
  AppstoreOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import services from '@/services';

interface setIsShowApplyProps {
  isShowApply: boolean;
  setIsShowApply: Dispatch<SetStateAction<boolean>>;
}

const MyCarpool: FC<setIsShowApplyProps> = (props) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const { isShowApply, setIsShowApply } = props;
  const [defaultText, setDefaultText] = useState<string>('');

  // 清空表单
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = (res: any) => {
    services(
      `/createCarFriend?aboutpay=${res.aboutpay}&totalnum=${res.totalnum}&getnum=${
        res.totalnum - 1
      }&starttime=${moment().valueOf()}&gotime=${res.allTime[1].valueOf()}&readtime=${res.allTime[0].valueOf()}&readyplace=${
        res.readyplace
      }&goplace=${res.goplace}&poolinglimit=0`,
      {
        method: 'post',
      },
    ).then(() => {
      onReset();
      setIsShowApply(!isShowApply);
    });
  };

  // 前后时间判断
  // Can not select days before today and today
  const disabledDate = (current: any) => {
    return current && current < moment().endOf('day');
  };

  // 清空form表单
  useEffect(() => {
    onReset();
  }, [isShowApply]);
  return (
    <Drawer
      title="我要拼车"
      visible={isShowApply}
      closable={false}
      placement="bottom"
      height="80%"
      onClose={() => {
        setIsShowApply(!isShowApply);
      }}
    >
      <Form form={form} initialValues={{ totalnum: 1 }} onFinish={onFinish}>
        <Row justify="center">
          <Col xs={10} sm={9} md={6} xl={3}>
            <Form.Item name="readyplace" rules={[{ required: true, message: '请输入出发地' }]}>
              <Input placeholder="出发地" />
            </Form.Item>
          </Col>
          <Col xs={4} sm={2} md={1} xl={1}>
            <Form.Item style={{ display: 'block', textAlign: 'center' }}>
              <EnvironmentOutlined />
              <ArrowRightOutlined />
            </Form.Item>
          </Col>
          <Col xs={10} sm={9} md={6} xl={3}>
            <Form.Item name="goplace" rules={[{ required: true, message: '请输入目的地' }]}>
              <Input placeholder="目的地" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <Form.Item name="allTime" rules={[{ required: true, message: '选择时间' }]}>
              <RangePicker
                disabledDate={disabledDate}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
          <Col xs={12} sm={9} md={6} xl={3}>
            <Form.Item name="totalnum" label="总人数">
              <Select
                // labelInValue={true} // 将value变成对象
                style={{ width: '100%' }}
              >
                <Option value={4}>4人</Option>
                <Option value={6}>6人</Option>
                <Option value={8}>8人</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col xs={12} sm={9} md={6} xl={3}>
            <Form.Item name="getnum" label="余座">
              <Select style={{ width: '100%' }}>
                <Option value={1}>1人</Option>
                <Option value={2}>2人</Option>
                <Option value={3}>3人</Option>
                <Option value={4}>4人</Option>
              </Select>
            </Form.Item>
          </Col> */}
        </Row>
        <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
          <Col xs={12} sm={10} md={6} xl={4}>
            <Form.Item name="aboutpay" rules={[{ required: true, message: '预估价格' }]}>
              <Input
                prefix={<MoneyCollectOutlined style={{ fontSize: '24px', color: '#5dd8d8' }} />}
                placeholder="预估价格"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col style={{ padding: '10px 0', color: 'red' }}>
            <span>仅有组队成员可以查看下面的信息 其他人不可见</span>
          </Col>
        </Row>
        <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
          <Col xs={12} sm={10} md={6} xl={4}>
            <Form.Item name="QQNum">
              <Input prefix={<QqOutlined style={{ fontSize: '24px', color: '#5dd8d8' }} />} placeholder="我的qq号" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={10} md={6} xl={4}>
            <Form.Item name="WXNum">
              <Input
                prefix={<WechatOutlined style={{ fontSize: '24px', color: '#39d662' }} />}
                placeholder="我的微信号"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={{ xs: 1, sm: 4, md: 8, xl: 32 }}>
          <Col xs={12} sm={10} md={6} xl={4}>
            <Form.Item name="phoneNum">
              <Input
                prefix={<MobileOutlined style={{ fontSize: '24px', color: '#5a4f69' }} />}
                placeholder="我的手机号"
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={10} md={6} xl={4}>
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
          <Col xs={23} sm={20} md={16} xl={9}>
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
          <Col xs={12} sm={10} md={6} xl={4}>
            <Form.Item>
              <Button htmlType="submit" type="primary" size="large" style={{ width: '100%' }}>
                提交
              </Button>
            </Form.Item>
          </Col>
          <Col xs={12} sm={10} md={6} xl={4}>
            <Form.Item>
              <Button htmlType="button" type="default" size="large" onClick={onReset} style={{ width: '100%' }}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default MyCarpool;
