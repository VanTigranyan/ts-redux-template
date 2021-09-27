import { createStore, applyMiddleware, PreloadedState } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootSaga from './sagas';
import rootReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const preloadedState: PreloadedState<any> = {};
const reduxStore = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);
const index = {
  ...reduxStore,
  close: () => index.dispatch(END),
};
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof index.dispatch;
export type RootState = ReturnType<typeof index.getState>;

export default index;
