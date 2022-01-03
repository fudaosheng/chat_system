import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppLayout } from './common/layout';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout></AppLayout>
    </BrowserRouter>
  );
};
