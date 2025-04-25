// This file extends the type definitions for flowbite-react components

import 'flowbite-react';

declare module 'flowbite-react' {
  // Extend ProgressProps to include label property
  export interface ProgressProps {
    label?: string;
  }

  // Extend ToggleSwitchProps if needed
  export interface ToggleSwitchProps {
    // Add any custom props here
  }
}
