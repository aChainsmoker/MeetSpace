import { createStore, applyMiddleware, Reducer } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import rootReducer, { RootState } from './reducers';
import { RootAction } from './actions/types';

const store = createStore<RootState, RootAction>(
  rootReducer as unknown as Reducer<RootState, RootAction>,
  applyMiddleware(thunk),
);

export type AppDispatch = ThunkDispatch<RootState, unknown, RootAction>;

export default store;
