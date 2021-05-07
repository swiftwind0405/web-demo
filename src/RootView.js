import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'dva/router';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';

/// #if ENV == 'dev'
import 'antd/dist/antd.less';
/// #endif

import ss from './RootView.less';

export const RootView = ({ isLogin, history }) => {

  return(
    <div>
      123
    </div>
  )
};
