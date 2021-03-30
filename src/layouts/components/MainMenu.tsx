/*
 * @Description: 未添加描述
 * @Date: 2021-02-24 11:30:00
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-30 00:44:58
 */
import type { FC } from 'react';
import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Avatar, Dropdown, message, Badge } from 'antd';
import { history, useModel, useRequest } from 'umi';
import Cookies from 'js-cookie';
import { UserOutlined, BellOutlined, SplitCellsOutlined } from '@ant-design/icons';
import styles from '../index.less';
import services from '@/services/index';

const MainMenu: FC<any> = (props) => {
  const { isLoading, setIsLoading } = useModel('useLoadingModel', (model) => {
    return { isLoading: model.isLoading, setIsLoading: model.setIsLoading };
  });
  const [user, setUser] = useState<Record<string, any>>(); // 用户信息
  const [isUser, setIsUser] = useState(0); // 展示头像模块
  const [hash, setHash] = useState<string>(''); // menu高亮显示路径
  const [code, setCode] = useState<string>(''); // qq返回的code码
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            history.push('/wm/UserInfo');
          }}
        >
          <UserOutlined />
          个人信息
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // history.push('/wm/UserInfo');
          }}
        >
          <Badge count={10} overflowCount={99} offset={[15, 0]}>
            <BellOutlined />
            我的消息
          </Badge>
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        danger
        onClick={() => {
          services('/exit').then(() => {
            Cookies.remove('userData');
            setIsUser(0);
            history.push('/wm');
            message.success('您已退出登录');
          });
        }}
      >
        <SplitCellsOutlined />
        退出登陆
      </Menu.Item>
    </Menu>
  );
  // 判断cookie中是否有信息 获取code
  useEffect(() => {
    const getCode = window.location.search.replace('?code=', '');
    if (getCode) setCode(getCode);
    if (Cookies.get('userData')) {
      setUser(Cookies.getJSON('userData'));
      setIsUser(1);
    }
  }, []);

  // 发送请求code请求
  const { data, error, run } = useRequest(
    (submitData) =>
      services(`/login/${code}`, {
        method: 'get',
        ...submitData,
      }),
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (code) {
      run({});
    }
  }, [code]);

  if (error) {
    message.error(error);
  }

  // 控制登录头像
  useEffect(() => {
    if (data && data.action === 'index') {
      Cookies.set('userData', data.data);
      setUser(Cookies.getJSON('userData'));
      setIsUser(1);
    }
  }, [data]);

  useEffect(() => {
    setHash(props.pathname);
  }, [props.pathname]);
  return (
    <Fragment>
      <Menu theme="dark" mode="horizontal" selectedKeys={[hash]}>
        <Menu.Item
          key="/wm"
          onClick={() => {
            history.push('/wm');
          }}
        >
          首 页
        </Menu.Item>
        <Menu.Item
          key="/wm/CarPoolHome"
          onClick={() => {
            history.push('/wm/CarPoolHome');
          }}
        >
          平院拼车
        </Menu.Item>
        <Menu.Item
          key="/wm/Driver"
          onClick={() => {
            history.push('/wm/Driver');
          }}
        >
          司机找单
        </Menu.Item>
        <Menu.Item
          key="/wm/DriverOrder"
          onClick={() => {
            history.push('/wm/DriverOrder');
          }}
        >
          我的接单
        </Menu.Item>
        <Menu.Item
          key="/wm/Contact"
          onClick={() => {
            history.push('/wm/Contact');
          }}
        >
          意见反馈
        </Menu.Item>

        {isUser === 1 ? (
          <Dropdown overlay={menu}>
            <div className={styles.boxes}>
              <Badge count={10} overflowCount={99} offset={[-15, 0]}>
                <Avatar className={styles.ava} size={'default'} src={user!.chatHead} />
                {user!.nickName}
              </Badge>
            </div>
          </Dropdown>
        ) : (
          <div
            className={styles.boxes}
            onClick={() => {
              // http://localhost:8000/
              // https://wenmeng.online/carFriend/
              window.location.href =
                'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101865958&scope=all&redirect_uri=http://www.wenmeng.online/api/toQQLogin&state=http://localhost:8000/';
            }}
          >
            <Avatar className={styles.ava} size={'default'} icon={<UserOutlined />} />
            请登录
          </div>
        )}
      </Menu>
    </Fragment>
  );
};

export default MainMenu;
