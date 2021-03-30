/*
 * @Description: 未添加描述
 * @Date: 2021-03-29 00:55:07
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-31 01:50:55
 */
import type { FC, Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import React, { Fragment } from 'react';
import { Card, Button, Drawer, Table, message, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { SwapRightOutlined, BellOutlined } from '@ant-design/icons';
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

const DriverCarpoolInfo: FC<CarpoolInfoProps> = (props) => {
  const { isShowDrawer, setIsShowDrawer, poolingInfo, inUserColumns, userData, placement } = props;
  const [form] = Form.useForm();
  const [isShowInfo, setIsShowInfo] = useState(false);

  const modelClick = () => {
    setIsShowInfo(!isShowInfo);
  };

  const clearForm = () => form.resetFields();

  const onFinish = (params) => {
    console.log(`params`, params);
    services(
      `/applyPull?poolingcarid=${poolingInfo.poolingcarid}&totalpay=${params.totalpay || 0}&viemsg=${
        params.viemsg || ''
      }`,
    ).then((params) => {
      if (params.state === 'success') message.success('申请成功');
      else if (params.msg === 'already existed') message.error('您已申请,请勿重复申请');
      else message.error('申请失败');
      setIsShowDrawer(!isShowDrawer);
      modelClick();
    });
    clearForm();
  };

  useEffect(() => {
    clearForm();
  }, [clearForm, isShowInfo]);

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

            <Button
              style={{ width: '30%', minWidth: '50px' }}
              type="primary"
              size="large"
              onClick={() => {
                // 申请司机
                modelClick();
              }}
            >
              申请司机
            </Button>
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
      </Drawer>

      <Modal
        visible={isShowInfo}
        closable={false}
        footer={null}
        onCancel={() => {
          modelClick();
        }}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="totalpay" label="要价">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="viemsg" label="留言">
            <Input.TextArea
              style={{ width: '100%' }}
              allowClear={true}
              key="text_area"
              autoSize={{ minRows: 4, maxRows: 6 }}
            ></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default DriverCarpoolInfo;
