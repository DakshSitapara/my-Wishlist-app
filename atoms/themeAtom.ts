import { atomWithStorage } from 'jotai/utils';

// This atom stores a boolean value in localStorage under the key 'dark-mode'
export const darkModeAtom = atomWithStorage<boolean>('dark-mode', false);
