import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../utils/appStore';

// ✅ Create a typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
