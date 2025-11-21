import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Color Schemes
const COLOR_SCHEMES = {
  Default: {
    primary: '#6200EE',
    primaryDark: '#3700B3',
    primaryLight: '#E8D5FF',
    secondary: '#03DAC6',
  },
  Blue: {
    primary: '#2196F3',
    primaryDark: '#1565C0',
    primaryLight: '#BBDEFB',
    secondary: '#00BCD4',
  },
  Green: {
    primary: '#4CAF50',
    primaryDark: '#2E7D32',
    primaryLight: '#C8E6C9',
    secondary: '#8BC34A',
  },
  Purple: {
    primary: '#9C27B0',
    primaryDark: '#6A1B9A',
    primaryLight: '#E1BEE7',
    secondary: '#BA68C8',
  },
  Orange: {
    primary: '#FF9800',
    primaryDark: '#F57C00',
    primaryLight: '#FFE0B2',
    secondary: '#FF5722',
  },
  Teal: {
    primary: '#009688',
    primaryDark: '#00695C',
    primaryLight: '#B2DFDB',
    secondary: '#26A69A',
  },
  Red: {
    primary: '#F44336',
    primaryDark: '#C62828',
    primaryLight: '#FFCDD2',
    secondary: '#E91E63',
  },
  Indigo: {
    primary: '#3F51B5',
    primaryDark: '#283593',
    primaryLight: '#C5CAE9',
    secondary: '#5C6BC0',
  },
  Pink: {
    primary: '#E91E63',
    primaryDark: '#C2185B',
    primaryLight: '#F8BBD0',
    secondary: '#FF4081',
  },
  Cyan: {
    primary: '#00BCD4',
    primaryDark: '#0097A7',
    primaryLight: '#B2EBF2',
    secondary: '#00E5FF',
  },
  Emerald: {
    primary: '#10B981',
    primaryDark: '#059669',
    primaryLight: '#D1FAE5',
    secondary: '#34D399',
  },
  Lime: {
    primary: '#CDDC39',
    primaryDark: '#AFB42B',
    primaryLight: '#F0F4C3',
    secondary: '#D4E157',
  },
};

// Light Theme Colors
const LIGHT_COLORS = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#000000',
  textDark: '#FFFFFF',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#B00020',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
};

// Dark Theme Colors
const DARK_COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textDark: '#000000',
  textSecondary: '#B0B0B0',
  border: '#424242',
  error: '#CF6679',
  success: '#81C784',
  warning: '#FFD54F',
  info: '#64B5F6',
};

// Common Colors
const COMMON_COLORS = {
  // Chart colors
  chart1: '#FF6384',
  chart2: '#36A2EB',
  chart3: '#FFCE56',
  chart4: '#4BC0C0',
  chart5: '#9966FF',
  chart6: '#FF9F40',
  chart7: '#FF6B6B',
  chart8: '#4ECDC4',
  
  // Risk colors
  lowRisk: '#4CAF50',
  moderateRisk: '#FFC107',
  highRisk: '#F44336',
  
  // Investment type colors
  invested: '#2196F3',
  liquid: '#00BCD4',
  
  // Target color
  target: '#9C27B0',
};

export const SIZES = {
  padding: 16,
  margin: 16,
  borderRadius: 8,
  iconSize: 24,
  avatarSize: 40,
};

export const FONTS = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 20,
  xlarge: 28,
  xxlarge: 36,
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('Light');
  const [colorScheme, setColorScheme] = useState('Blue');
  const [loading, setLoading] = useState(false);

  const colors = React.useMemo(() => {
    const baseColors = theme === 'Dark' ? DARK_COLORS : LIGHT_COLORS;
    const schemeColors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.Default;
    
    return {
      ...baseColors,
      ...schemeColors,
      ...COMMON_COLORS,
    };
  }, [theme, colorScheme]);

  const value = React.useMemo(() => ({
    theme,
    colorScheme,
    colors,
    updateTheme: setTheme,
    updateColorScheme: setColorScheme,
    loading,
  }), [theme, colorScheme, colors, loading]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
