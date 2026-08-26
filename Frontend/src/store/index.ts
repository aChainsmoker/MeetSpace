import { applyMiddleware, createStore } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import rootReducer, { RootState } from './reducers';
import { RootAction } from './actions/types';

const store = createStore(rootReducer, undefined, applyMiddleware(thunk));

export type AppDispatch = ThunkDispatch<RootState, undefined, RootAction>;

export default store;
