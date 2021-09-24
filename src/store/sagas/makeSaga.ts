import { takeLatest, call, cancel } from 'redux-saga/effects';
import fetchEntity from '../../api/fetchEntity';
import { ActionInterface } from '../actions/action-generator';

export interface IMakeSaga {
  api?: Function;
  load?: GeneratorFunction | null;
  take?: typeof takeLatest;
}
export type makeSageParams = IMakeSaga & ActionInterface;

export const makeSaga = ({
  actions,
  actionName,
  cancelActionName,
  api = () => null,
  load = null,
  take = takeLatest,
}: makeSageParams) => {
  // @ts-ignore
  const fetch = fetchEntity.bind(null, actions, api);
  function* loadRequest(data: ActionInterface) {
    yield call(fetch, data);
  }
  return function* () {
    const actionWatcher = load === null ? loadRequest : load.bind(null, fetch);
    let watcher = yield take(actionName, actionWatcher);
    if (cancelActionName) {
      yield take(cancelActionName, function* () {
        yield cancel(watcher);
        watcher = yield take(actionName, actionWatcher);
      });
    }
  };
};
