// @flow
import { applyMiddleware, createStore ,compose} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import logger from './logger';
import reducers from '../reducers';

const persistedReducer = persistReducer({
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user'],
}, reducers);

const configureStore = () => {
    const enhancer = applyMiddleware(thunk, promise, logger);
    const store = createStore(persistedReducer, enhancer);

    const persistor = persistStore(store);
    return { store, persistor };
};

export default configureStore;
