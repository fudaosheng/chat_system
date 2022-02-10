import { useEffect } from 'react';

interface Ref<T> {
  current: { contains: (arg0: T | null) => any } | null;
}
export const useOnClickOutSide = <T>(ref: Ref<T>, handle: () => void) => {
  useEffect(() => {
    const handleOutSide = (e: MouseEvent) => {
      if (!ref?.current || ref.current.contains(e?.target as any)) {
        return;
      }
      console.log('---');
      
      handle();
    };
    document.addEventListener('click', handleOutSide);
    return () => document.removeEventListener('click', handleOutSide);
  }, [ref]);
};
