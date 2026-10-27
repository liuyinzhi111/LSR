'use client';

import { useSyncExternalStore } from 'react';

// Keep this breakpoint in sync with the visibility rules in globals.css.
export const COMPACT_QUERY = '(max-width: 1024px)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(COMPACT_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function useCompactLayout() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COMPACT_QUERY).matches,
    () => false,
  );
}
