import { combineReducers, Reducer } from 'redux';

const app: Reducer = (state = {}) => state;

const combinedReducers = {
  app,
};

export default combineReducers(combinedReducers);
