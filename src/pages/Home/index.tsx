/*
 * @Description: 未添加描述
 * @Date: 2021-02-23 16:44:26
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-12 14:43:10
 */
import type { FC } from 'react';
import React, { Fragment } from 'react';
import { Carousel, Image } from 'antd';
import styles from './index.less';

const Home: FC = () => {
  return (
    <Fragment>
      <div className={styles.box}>
        <Carousel autoplay>
          <div className={styles.contentStyle}>
            <Image
              src={require('../../images/1.png')}
              width="100%"
              height="100%"
              style={{ overflow: 'hidden', borderImageRepeat: 'space' }}
            />
          </div>
          <div className={styles.contentStyle}>
            <Image
              src={require('../../images/3.png')}
              width="100%"
              height="100%"
              style={{ overflow: 'hidden', borderImageRepeat: 'space' }}
            />
          </div>
          <div className={styles.contentStyle}>
            <Image
              src={require('../../images/4.png')}
              width="100%"
              height="100%"
              style={{ overflow: 'hidden', borderImageRepeat: 'space' }}
            />
          </div>
        </Carousel>
        <h1 className={styles.title}>站长寄语</h1>
        <div className={styles.context}>
          <p>这个网站嘛…其实我也不晓得要干嘛………</p>
          <p>
            其实呢，做个网站挺容易的，就是不晓得干嘛，搭起来了吧…没人用……挺悲催的是不！那就做点有用的吧！比如呢~还是不晓得……(一脸尴尬)
          </p>
          <p>
            后来想了想！无论出门去玩还是放假回家，都是需要坐车……一个人坐吧！不符合国家要求是不？？(低碳环保呢！！)。坐公交吧…明明20分钟车程给我整一小时【疯狂吐血中······】。那就做个拼车的网站吧，缓解社会压力和方便咱们出行。
          </p>
          <p>于是乎！！！神奇的拼车网站出来了，首次与大家见面！！</p>
          <p>······</p>
          <p>······</p>
          <p>······</p>
          <p>那么…你想让这个网站做点什么？？ 来吧！发挥你的想象在 [意见反馈] 中提意见吧</p>
        </div>
      </div>
    </Fragment>
  );
};
export default Home;
