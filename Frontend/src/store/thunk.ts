import {ThunkAction} from 'redux-thunk';
import {RootState} from './reducers';
import {RootAction} from './actions/types';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    undefined,
    RootAction
>;
