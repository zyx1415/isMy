/*
 * @Description: 未添加描述
 * @Date: 2021-02-24 09:42:06
 * @LastEditors: JackyChou
 * @LastEditTime: 2021-02-24 10:11:52
 */

import { useState } from 'react';

export default () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return { isLoading, setIsLoading };
};
