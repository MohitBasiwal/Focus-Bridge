/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ThemeProvider } from './ui/theme/ThemeContext';
import { AppNavigation } from './navigation/AppNavigation';
import { BootReceiver } from './receivers/BootReceiver';

import { ErrorBoundary } from './ui/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    BootReceiver.onBoot();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
    </ErrorBoundary>
  );
}
