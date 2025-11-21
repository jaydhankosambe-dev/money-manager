import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from '../components/Icon';
import { settingsAPI } from '../services/api';
import { getUser } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../utils/useAppTheme';
import Sidebar from '../components/Sidebar';

const windowWidth = Dimensions.get('window').width;
const isDesktop = windowWidth > 768;

export default function SettingsScreen({ navigation }) {
  const { colors: COLORS, theme, colorScheme, updateTheme, updateColorScheme } = useTheme();
  const { logout } = useAuth();
  const { SIZES, FONTS } = useAppTheme();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);

      const settingsData = await settingsAPI.getSettings();
      if (!settingsData.dashboardColorScheme) {
        settingsData.dashboardColorScheme = 'Blue';
      }
      if (!settingsData.theme) {
        settingsData.theme = 'Light';
      }
      setSettings(settingsData);
      
      updateTheme(settingsData.theme);
      updateColorScheme(settingsData.dashboardColorScheme);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    setUpdating(true);
    try {
      const updatedSettings = await settingsAPI.updateSettings({ [key]: value });
      setSettings(updatedSettings);
      
      if (key === 'theme') {
        updateTheme(value);
      } else if (key === 'dashboardColorScheme') {
        updateColorScheme(value);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const getSchemeColor = (scheme) => {
    const colors = {
      Blue: '#2196F3',
      Green: '#4CAF50',
      Purple: '#9C27B0',
      Orange: '#FF9800',
      Teal: '#009688',
      Red: '#F44336',
      Indigo: '#3F51B5',
      Pink: '#E91E63',
      Cyan: '#00BCD4',
      Emerald: '#10B981',
      Lime: '#CDDC39',
    };
    return colors[scheme] || colors.Blue;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isDesktop && <Sidebar navigation={navigation} currentRoute="Settings" />}
      
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            {user?.profilePhotoUrl ? (
              <Image source={{ uri: user.profilePhotoUrl }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profileInitials}>
                <Text style={styles.profileInitialsText}>{getUserInitials()}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          {/* Dashboard View Type */}
          <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Asset Display</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>View Type</Text>
            <View style={styles.viewTypeButtons}>
              {['Grid', 'Tiles', 'Panel'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.viewTypeButton,
                    (settings?.dashboardViewType || 'Grid') === type && styles.viewTypeButtonActive,
                  ]}
                  onPress={() => updateSetting('dashboardViewType', type)}
                  disabled={updating}
                >
                  <Icon
                    name={
                      type === 'Grid' ? 'grid' :
                      type === 'Tiles' ? 'list' : 'albums'
                    }
                    size={20}
                    color={(settings?.dashboardViewType || 'Grid') === type ? COLORS.textDark : COLORS.text}
                  />
                  <Text
                    style={[
                      styles.viewTypeText,
                      (settings?.dashboardViewType || 'Grid') === type && styles.viewTypeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          </View>

          {/* Theme */}
          <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Theme</Text>
          
          <View style={styles.themeButtons}>
            {['Light', 'Dark'].map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={[
                  styles.themeButton,
                  (settings?.theme || 'Light') === themeOption && styles.themeButtonActive,
                ]}
                onPress={() => updateSetting('theme', themeOption)}
                disabled={updating}
              >
                <Icon
                  name={themeOption === 'Light' ? 'sunny' : 'moon'}
                  size={24}
                  color={(settings?.theme || 'Light') === themeOption ? COLORS.textDark : COLORS.text}
                />
                <Text
                  style={[
                    styles.themeText,
                    (settings?.theme || 'Light') === themeOption && styles.themeTextActive,
                  ]}
                >
                  {themeOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          </View>

          {/* Color Scheme */}
          <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Color Scheme</Text>
          
          <View style={styles.colorButtons}>
            {['Blue', 'Green', 'Purple', 'Orange', 'Teal', 'Red', 'Indigo', 'Pink', 'Cyan', 'Emerald', 'Lime'].map((scheme) => (
              <TouchableOpacity
                key={scheme}
                style={[
                  styles.colorButton,
                  (settings?.dashboardColorScheme || 'Blue') === scheme && styles.colorButtonActive,
                ]}
                onPress={() => updateSetting('dashboardColorScheme', scheme)}
                disabled={updating}
              >
                <View style={[styles.colorPreview, { backgroundColor: getSchemeColor(scheme) }]} />
                <Text
                  style={[
                    styles.colorText,
                    (settings?.dashboardColorScheme || 'Blue') === scheme && styles.colorTextActive,
                  ]}
                >
                  {scheme}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="log-out" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Money Manager v1.0.0</Text>
            <Text style={styles.footerText}>Tap logout above to sign out</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (COLORS, SIZES, FONTS) => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 21,
    paddingBottom: 33,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profilePhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInitials: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialsText: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
  },
  section: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  panel: {
    padding: SIZES.padding * 1.5,
    backgroundColor: COLORS.surface,
    margin: SIZES.margin,
    borderRadius: SIZES.borderRadius * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  viewTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 5,
  },
  viewTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  viewTypeText: {
    fontSize: FONTS.small,
    color: COLORS.text,
  },
  viewTypeTextActive: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  themeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  themeText: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  themeTextActive: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  colorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  colorButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  colorText: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  colorTextActive: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.margin * 2,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.error,
    gap: 10,
  },
  logoutText: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
});
