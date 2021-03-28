/*
 * @Description: 未添加描述
 * @Date: 2021-02-20 14:49:25
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-26 22:55:09
 */
import { Input, Form, Descriptions, Button, message, Select, InputNumber } from 'antd';
import type { FC } from 'react';
import React, { Fragment, useEffect, useState } from 'react';
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  QqOutlined,
  WechatOutlined,
  AlignLeftOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import services from '@/services/index';

const MyInfo: FC = () => {
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [isChange, setIsChange] = useState(0);
  const [form] = Form.useForm();
  const checkPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  const checkEmail = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  // 表单样式
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 10 },
  };

  // 判断用户信息是否为空
  const isNull = (params: any) => {
    return params !== null ? params : '您还未补全此信息';
  };

  // 表单函数
  const onFinish = (values: any) => {
    if (!checkPhone.test(values.phone)) {
      message.error('请输入正确的电话号码');
    } else if (!checkEmail.test(values.email)) {
      message.error('请输入正确的邮箱');
    } else {
      message.loading({ content: 'Loading...', key: 'success' });
      setTimeout(() => {
        message.success({ content: '添加成功!', key: 'success', duration: 1 });
        // 修改邮箱密码
        services(
          `/updateUserInfo?qqnum=${values.qqnum}&wxnum=${values.wxnum}&phone=${values.phone}&age=${values.age}&email=${values.email}&signature=${values.signature}&realname=${values.realname}`,
          { method: 'post' },
        ).then(() => {
          form.resetFields();
          setIsChange(isChange === 0 ? 1 : 0);
          services(`/getUserInfo/`, { method: 'get' }).then((res) => {
            setUserData(res.data);
          });
        });
      }, 1000);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 清空表单
  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    services(`/getUserInfo`, { method: 'get' }).then((res) => {
      console.log(`res`, res);
      setUserData(res.data);
    });
  }, []);

  useEffect(() => {
    form.resetFields();
  }, [userData]);
  return (
    <Fragment>
      <Descriptions
        bordered={true}
        title="个人信息"
        size="default"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setIsChange(isChange === 0 ? 1 : 0);
            }}
          >
            补全个人信息
          </Button>
        }
      >
        <Descriptions.Item label="昵称">{isNull(userData.nickname)}</Descriptions.Item>
        <Descriptions.Item label="性别">{isNull(userData.gender) === 1 ? '男' : '女'}</Descriptions.Item>
        <Descriptions.Item label="age">{isNull(userData.age)}</Descriptions.Item>
        <Descriptions.Item label="真实姓名">{isNull(userData.realname)}</Descriptions.Item>
        <Descriptions.Item label="电话">{isNull(userData.phone)}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{isNull(userData.email)}</Descriptions.Item>
        <Descriptions.Item label="信誉值">{isNull(userData.credibility)}</Descriptions.Item>
        <Descriptions.Item label="QQ">{isNull(userData.qqnum)}</Descriptions.Item>
        <Descriptions.Item label="微信号">{isNull(userData.wxnum)}</Descriptions.Item>
        <Descriptions.Item label="个人签名" span={12}>
          {isNull(userData.signature)}
        </Descriptions.Item>
        <Descriptions.Item label="钱包(元)">{isNull(userData.wallet)}</Descriptions.Item>
      </Descriptions>

      <div className={styles.container} style={{ zIndex: isChange !== 0 ? 200 : -1 }}>
        <div
          className={styles.container_mask}
          style={{ opacity: isChange !== 0 ? 0.3 : 0 }}
          // 点击阴影部分隐藏提交表单
          onClick={() => {
            form.resetFields();
            setIsChange(isChange === 0 ? 1 : 0);
          }}
        />
        <div
          className={styles.container_body}
          style={{ transform: `translateX(${isChange !== 0 ? 0 : -200}px)`, marginTop: window.innerHeight / 6 }}
        >
          <Form
            form={form}
            style={{
              width: '80%',
              marginTop: '50px',
            }}
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
              realname: userData.realname,
              signature: userData.signature,
              gender: userData.gender,
              age: userData.age,
              qqnum: userData.qqnum,
              wxnum: userData.wxnum,
              email: userData.email,
              phone: userData.phone,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="真实姓名" name="realname" rules={[{ required: true, message: '请输入真实姓名' }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' }]}>
              <InputNumber max={99} min={5} />
            </Form.Item>

            <Form.Item label="QQ" name="qqnum">
              <Input prefix={<QqOutlined />} />
            </Form.Item>
            <Form.Item label="微信" name="wxnum">
              <Input prefix={<WechatOutlined />} />
            </Form.Item>
            <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item label="电话" name="phone" rules={[{ required: true, message: '请输入电话号码' }]}>
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item label="个性签名" name="signature">
              <Input prefix={<AlignLeftOutlined />} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <Button htmlType="submit" type="primary" size="large" style={{ width: '40%' }}>
                  提交
                </Button>
                <Button htmlType="button" type="default" size="large" onClick={onReset} style={{ width: '40%' }}>
                  重置
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Fragment>
  );
};

export default MyInfo;
