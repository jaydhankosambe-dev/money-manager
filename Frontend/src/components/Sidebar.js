import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../utils/useAppTheme';
import { useSidebar } from '../contexts/SidebarContext';

const windowWidth = Dimensions.get('window').width;

const menuItems = [
  { name: 'Dashboard', icon: 'home', route: 'Dashboard' },
  { name: 'Assets', icon: 'wallet', route: 'Assets' },
  { name: 'Tracker', icon: 'calendar', route: 'Tracker' },
  { name: 'Charts', icon: 'pie-chart', route: 'Charts' },
  { name: 'Settings', icon: 'settings', route: 'Settings' },
];

export default function Sidebar({ navigation, currentRoute }) {
  const { COLORS, SIZES, FONTS } = useAppTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  const handleNavigate = useCallback((route) => {
    if (navigation?.navigate) {
      navigation.navigate(route);
    }
  }, [navigation]);

  return (
    <View style={[styles.sidebar, isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded]}>
      <View style={styles.topSection}>
        <Text style={[styles.appTitle, isCollapsed && styles.appTitleHidden]}>Money Manager</Text>
        <TouchableOpacity 
          style={styles.collapseButton} 
          onPress={toggleSidebar}
        >
          <Ionicons 
            name={isCollapsed ? 'chevron-forward' : 'chevron-back'} 
            size={24} 
            color={COLORS.text} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.menuItem,
              currentRoute === item.route && styles.menuItemActive
            ]}
            onPress={() => handleNavigate(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={currentRoute === item.route ? COLORS.primary : COLORS.text}
            />
            {!isCollapsed && (
              <Text
                style={[
                  styles.menuText,
                  currentRoute === item.route && styles.menuTextActive
                ]}
              >
                {item.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (COLORS, SIZES, FONTS) => StyleSheet.create({
  sidebar: {
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarExpanded: {
    width: 240,
  },
  sidebarCollapsed: {
    width: 70,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  appTitleHidden: {
    display: 'none',
  },
  collapseButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: SIZES.borderRadius,
  },
  menuItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  menuText: {
    marginLeft: 15,
    fontSize: FONTS.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  menuTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
