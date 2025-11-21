import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import Icon from '../components/Icon';
import { dashboardAPI } from '../services/api';
import { getUser } from '../utils/storage';
import { useAppTheme } from '../utils/useAppTheme';
import Sidebar from '../components/Sidebar';
import RingChart from '../components/RingChart';

const windowWidth = Dimensions.get('window').width;
const isDesktop = windowWidth > 768;

const formatIndianCurrency = (amount) => {
  if (!amount) return '0';
  const numStr = Math.floor(amount).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
};

export default function DashboardScreen({ navigation }) {
  const { COLORS, SIZES, FONTS } = useAppTheme();
  const [dashboard, setDashboard] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  const loadData = useCallback(async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      
      const data = await dashboardAPI.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  const calculateInvestedAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.investmentType === 'Invested')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [dashboard?.assets]);

  const calculateLiquidAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.investmentType === 'Liquid')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [dashboard?.assets]);

  const calculateLendAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.investmentType === 'Lend')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [dashboard?.assets]);

  const calculatePercentage = useCallback((amount) => {
    if (!dashboard?.totalAmount || dashboard.totalAmount === 0) return 0;
    return ((amount / dashboard.totalAmount) * 100).toFixed(1);
  }, [dashboard?.totalAmount]);

  const calculateLowRiskAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.riskCategory === 'Low')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [dashboard?.assets]);

  const calculateModerateRiskAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.riskCategory === 'Moderate')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [dashboard?.assets]);

  const calculateHighRiskAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.riskCategory === 'High')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [dashboard?.assets]);

  const calculateTargetAmount = useMemo(() => {
    if (!dashboard?.assets) return 0;
    return dashboard.assets
      .filter(e => e.targetAmount)
      .reduce((sum, e) => sum + e.targetAmount, 0);
  }, [dashboard?.assets]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Calculate amounts using memoized values
  const investedAmount = calculateInvestedAmount;
  const liquidAmount = calculateLiquidAmount;
  const lendAmount = calculateLendAmount;
  const lowRiskAmount = calculateLowRiskAmount;
  const moderateRiskAmount = calculateModerateRiskAmount;
  const highRiskAmount = calculateHighRiskAmount;
  const targetAmount = calculateTargetAmount;

  return (
    <View style={styles.container}>
      {isDesktop && <Sidebar navigation={navigation} currentRoute="Dashboard" />}
      
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* First Row - Target and Total */}
          <View style={styles.rowPanel}>
            <Text style={styles.rowPanelTitle}>Financial Targets</Text>
            <View style={styles.statsContainer}>
              <View style={[styles.subPanel, styles.targetPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="flag" size={24} color={COLORS.target} />
                <Text style={styles.subPanelLabel}>Target Amount</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.targetAmount]}>₹{targetAmount ? formatIndianCurrency(targetAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={dashboard?.totalAmount && targetAmount ? (dashboard.totalAmount / targetAmount) * 100 : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.target}
                />
              </View>
            </View>

            <View style={[styles.subPanel, styles.totalPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="wallet" size={24} color={COLORS.primary} />
                <Text style={styles.subPanelLabel}>Total Amount</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.totalAmount]}>₹{dashboard?.totalAmount ? formatIndianCurrency(dashboard.totalAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={100}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.primary}
                />
              </View>
            </View>
            </View>
          </View>

          {/* Second Row - Invested and Liquid */}
          <View style={styles.rowPanel}>
            <Text style={styles.rowPanelTitle}>Investment Breakdown</Text>
            <View style={styles.statsContainer}>
            <View style={[styles.subPanel, styles.investedPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="trending-up" size={24} color={COLORS.invested} />
                <Text style={styles.subPanelLabel}>Invested</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.investedAmount]}>₹{investedAmount ? formatIndianCurrency(investedAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={investedAmount ? parseFloat(calculatePercentage(investedAmount)) : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.invested}
                />
              </View>
            </View>

            <View style={[styles.subPanel, styles.liquidPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="cash" size={24} color={COLORS.liquid} />
                <Text style={styles.subPanelLabel}>Liquid</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.liquidAmount]}>₹{liquidAmount ? formatIndianCurrency(liquidAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={liquidAmount ? parseFloat(calculatePercentage(liquidAmount)) : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.liquid}
                />
              </View>
            </View>

            <View style={[styles.subPanel, styles.lendPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="handshake" size={24} color={COLORS.lend} />
                <Text style={styles.subPanelLabel}>Lend</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.lendAmount]}>₹{lendAmount ? formatIndianCurrency(lendAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={lendAmount ? parseFloat(calculatePercentage(lendAmount)) : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.lend}
                />
              </View>
            </View>
            </View>
          </View>

          {/* Third Row - Risk Categories */}
          <View style={styles.rowPanel}>
            <Text style={styles.rowPanelTitle}>Risk Distribution</Text>
            <View style={styles.statsContainer}>
            <View style={[styles.subPanel, styles.lowRiskPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="shield-checkmark" size={24} color={COLORS.lowRisk} />
                <Text style={styles.subPanelLabel}>Low Risk</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.lowRiskAmount]}>₹{lowRiskAmount ? formatIndianCurrency(lowRiskAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={lowRiskAmount ? parseFloat(calculatePercentage(lowRiskAmount)) : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.lowRisk}
                />
              </View>
            </View>

            <View style={[styles.subPanel, styles.moderateRiskPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="warning" size={24} color={COLORS.moderateRisk} />
                <Text style={styles.subPanelLabel}>Moderate Risk</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.moderateRiskAmount]}>₹{moderateRiskAmount ? formatIndianCurrency(moderateRiskAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={moderateRiskAmount ? parseFloat(calculatePercentage(moderateRiskAmount)) : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.moderateRisk}
                />
              </View>
            </View>

            <View style={[styles.subPanel, styles.highRiskPanel]}>
              <View style={styles.subPanelHeader}>
                <Icon name="alert" size={24} color={COLORS.highRisk} />
                <Text style={styles.subPanelLabel}>High Risk</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.panelLeft}>
                  <Text style={[styles.subPanelAmount, styles.highRiskAmount]}>₹{highRiskAmount ? formatIndianCurrency(highRiskAmount) : '0'}</Text></View>
                <RingChart 
                  percentage={highRiskAmount ? parseFloat(calculatePercentage(highRiskAmount)) : 0}
                  size={60}
                  strokeWidth={8}
                  color={COLORS.highRisk}
                />
              </View>
            </View>
            </View>
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
  userProfile: {
    width: SIZES.avatarSize,
    height: SIZES.avatarSize,
    borderRadius: SIZES.avatarSize / 2,
    overflow: 'hidden',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profileInitials: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialsText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  rowPanel: {
    margin: SIZES.padding,
    marginBottom: SIZES.padding * 0.5,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rowPanelTitle: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 0.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statsContainer: {
    padding: SIZES.padding,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 15,
  },
  totalPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  targetPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.target,
  },
  subPanel: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  investedPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.invested,
  },
  liquidPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.liquid,
  },
  lendPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.lend,
  },
  lowRiskPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.lowRisk,
  },
  moderateRiskPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.moderateRisk,
  },
  highRiskPanel: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.highRisk,
  },
  subPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  panelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
    marginTop: -8,
  },
  panelLeft: {
    flex: 1,
  },
  subPanelLabel: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  subPanelAmount: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  subPanelPercentage: {
    fontSize: FONTS.regular,
    color: COLORS.success,
    fontWeight: '600',
  },
  targetAmount: {
    color: COLORS.target,
  },
  totalAmount: {
    color: COLORS.primary,
  },
  investedAmount: {
    color: COLORS.invested,
  },
  liquidAmount: {
    color: COLORS.liquid,
  },
  lendAmount: {
    color: COLORS.lend,
  },
  lowRiskAmount: {
    color: COLORS.lowRisk,
  },
  moderateRiskAmount: {
    color: COLORS.moderateRisk,
  },
  highRiskAmount: {
    color: COLORS.highRisk,
  },
  section: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
});
