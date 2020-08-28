import React from 'react';
import { useSelector } from '../store';
import Theme from './Theme';
// @ts-ignore
import Div100vh from 'react-div-100vh';
import { styleHelpers } from '../utils';

export function Page({
  children
}: {
  children: React.ReactNode
}) {
  const theme = Theme.useTheme();
  const darkNavbar = useSelector(s => s.navigation.darkNavbar);

  return (
    <Div100vh>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          minHeight: '100%',
          ...styleHelpers.flex('column')
        }}
        className={darkNavbar ? 'dark-mode' : undefined}
      >
        {children}
      </div>
    </Div100vh>
  )
}