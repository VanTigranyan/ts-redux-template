import {createStore, applyMiddleware, PreloadedState} from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootSaga from './sagas';
import rootReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const preloadedState: PreloadedState<any> = {};
const reduxStore = createStore(rootReducer, preloadedState, composeWithDevTools(applyMiddleware(...middlewares)));
const store = {
  ...reduxStore,
  close: () => store.dispatch(END),
};
sagaMiddleware.run(rootSaga);


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
