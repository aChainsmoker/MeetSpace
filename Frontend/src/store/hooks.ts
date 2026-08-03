import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './index';
import type { RootState } from './reducers';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
  useSelector(selector);
