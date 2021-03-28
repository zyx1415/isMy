/*
 * @Description: 未添加描述
 * @Date: 2021-02-18 16:16:09
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-16 16:13:44
 */
import services from '@/services';
import { Button, Form, Input, message } from 'antd';
import type { FC } from 'react';
import React from 'react';
import styles from './index.less';

const Contact: FC = () => {
  const [form] = Form.useForm();
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 10 },
  };

  const onFinish = (res: any) => {
    services(`/sendEmail/${res.emileName}/${res.emileConcent}`)
      .then(() => {
        message.success('发送成功');
      })
      .catch((err) => {
        message.error('发送失败', err);
      });
    form.resetFields();
  };

  const onFinishFailed = () => {
    message.error('您的信息尚未完整哦，请仔细检查');
  };

  return (
    <div className={styles.box}>
      <Form
        form={form}
        {...layout}
        className={styles.forms}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="邮件标题" name="emileName" rules={[{ required: true, message: '请输入邮件标题' }]}>
          <Input allowClear={true} placeholder="请输入邮件标题哦" />
        </Form.Item>

        <Form.Item label="邮件内容" name="emileConcent" rules={[{ required: true, message: '请输入邮件内容' }]}>
          <Input.TextArea className={styles.textArea} placeholder="请提出您宝贵的意见" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button htmlType="submit" type="primary" size="large" style={{ width: '80%', maxWidth: '300px' }}>
              提交
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Contact;
