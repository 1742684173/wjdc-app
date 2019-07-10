// @flow
import { applyMiddleware, createStore ,compose} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import logger from './logger';
import reducers from '../reducers';
import createSagaMiddleware from 'redux-saga';
import saga from '../saga';

const persistedReducer = persistReducer({
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user'],
}, reducers);

const sagaMiddleware = createSagaMiddleware();

// export const store = createStore(
//     reducers, // 合并reducer
//     window.devToolsExtension ? window.devToolsExtension() : undefined, // dev-tools
//     applyMiddleware(sagaMiddleware)  // 中间件，加载sagaMiddleware
// )
//
// sagaMiddleware.run(saga)// 执行rootSaga

const configureStore = () => {
    // const enhancer = applyMiddleware(thunk, promise, logger);
    const enhancer = applyMiddleware(sagaMiddleware, promise, logger);
    const store = createStore(persistedReducer, enhancer);

    sagaMiddleware.run(saga)// 执行rootSaga
    const persistor = persistStore(store);
    return { store, persistor };
};

export default configureStore;
