/*
 * @Description: 未添加描述
 * @Date: 2021-02-23 16:52:29
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-12 15:20:22
 */
import type { FC } from 'react';
import React from 'react';
import type { IRouteComponentProps } from 'umi';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';
import MainMenu from './components/MainMenu';
import FootMenu from './components/FootMenu';

const { Header, Footer, Content } = Layout;

const Layouts: FC<IRouteComponentProps> = (props) => {
  const { children, history } = props;
  const { pathname } = history.location;
  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ width: '100%', height: '100%' }}>
        <Header>
          <MainMenu pathname={pathname} />
        </Header>
        <Content>
          <div className={styles.site_layout_content} style={{ minHeight: `${window.innerHeight - 140}px` }}>
            {/* 页面内容 */}
            {children}
          </div>
        </Content>
        <Footer className={styles.foot}>
          <FootMenu />
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};
export default Layouts;
