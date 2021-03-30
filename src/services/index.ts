/*
 * @Description: 未添加描述
 * @Date: 2021-02-24 15:29:35
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-28 13:40:19
 */
import { request } from 'umi';
import type { RequestOptionsInit } from 'umi-request';

interface ServiceProps {
  (url: string, params?: RequestParams): Promise<any>;
}

interface RequestParams extends RequestOptionsInit {
  method?: 'get' | 'post' | 'put' | 'delete';
  skipErrorHandler?: boolean | undefined;
}

export const baseURL: string = 'https://wenmeng.online/carPooling';

const services: ServiceProps = (url, params) => {
  return request(baseURL + url, {
    ...params,
    credentials: 'include',
  });
};

export default services;
