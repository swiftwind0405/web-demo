import React from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';
import createImmer from 'dva-immer';
import {createBrowserHistory} from 'history'

const DVA = dva({ history: createBrowserHistory() });

DVA.use(createImmer());
DVA.use(createLoading());

// eslint-disable-next-line global-require
const { RootView } = require('@/RootView');
DVA.router(({ history }) => <RootView isLogin={false} history={history} />);
DVA.start('#root');
