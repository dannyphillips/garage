import type { CSSProperties } from 'react';
import type { GarageApp } from '../types/app';
import { getAppAccent } from '../lib/appTheme';

interface AppIconProps {
  app: GarageApp;
  size?: 'md' | 'lg' | 'xl';
}

const sizes = {
  md: 'app-icon-md',
  lg: 'app-icon-lg',
  xl: 'app-icon-xl',
};

export function AppIcon({ app, size = 'md' }: AppIconProps) {
  const accent = getAppAccent(app.category);

  return (
    <div
      className={`app-icon ${sizes[size]}`}
      style={
        {
          '--icon-from': accent.from,
          '--icon-to': accent.to,
          '--icon-glow': accent.glow,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span>{app.icon}</span>
    </div>
  );
}
