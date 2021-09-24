import { all, fork } from 'redux-saga/effects';
import { makeSaga } from './makeSaga';

export default function* rootSaga() {
  // @ts-ignore
  yield all([fork(makeSaga())]);
}
