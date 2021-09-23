import {createStore, applyMiddleware, PreloadedState, Store} from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootSaga from './sagas';
import rootReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

type AppStore = Store & { close: Function };
const preloadedState: PreloadedState<any> = {};
const store = createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(...middlewares)));

sagaMiddleware.run(rootSaga);
store.close = () => store.dispatch(END);


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
