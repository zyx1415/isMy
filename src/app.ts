/*
 * @Description: 未添加描述
 * @Date: 2021-02-24 16:47:03
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-03-25 20:55:28
 */
import { message } from 'antd';
import type { RequestConfig } from 'umi';

interface errorProps {
  response: Response;
  name: string;
  data: any;
}

type codeMessageProps = Record<number, string>;
// 服务器返回的错误代码
const codeMessage: codeMessageProps = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 异常处理
const errorHandler = (error: errorProps): Response => {
  const { response } = error;
  if (error.name === 'BizError') {
    // 这个是请求数据中的错误代码的处理方式，即请求成功, 且反回错误处理代码（adaptor中的success为false的时候）
    message.error(error.data.info, 2);
  } else if (response && response.status) {
    // 这是请求错误中的处理方式
    const errorText = codeMessage[response.status as number] || response.statusText;
    const { status } = response;
    message.error(`请求错误:${status},${errorText}`, 3);
  } else if (!response) {
    message.error(`请求错误:网络发生异常,无法连接服务器`, 3);
  }
  return response;
};

export const request: RequestConfig = {
  timeout: 2000,
  errorHandler,
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: true,
        errorMessage: resData.info || '请求失败',
      };
    },
  },
  headers: {
    'Content-Type': 'application/json',
  },
  // middlewares: [],
  // requestInterceptors: [],
  // responseInterceptors: [],
};
