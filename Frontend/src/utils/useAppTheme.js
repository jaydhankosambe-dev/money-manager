import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS } from './theme';

// Custom hook to use in all screens
export const useAppTheme = () => {
  const { colors, theme, colorScheme, updateTheme, updateColorScheme } = useTheme();
  
  return {
    COLORS: colors,
    SIZES,
    FONTS,
    theme,
    colorScheme,
    updateTheme,
    updateColorScheme,
  };
};
