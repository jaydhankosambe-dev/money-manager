import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { chartAPI } from '../services/api';
import { useAppTheme } from '../utils/useAppTheme';
import Sidebar from '../components/Sidebar';

const screenWidth = Dimensions.get('window').width;
const isDesktop = screenWidth > 768;

// Custom Doughnut Chart Component
const DoughnutChart = ({ data, centerText }) => {
  if (!data || data.length === 0) {
    return null;
  }
  
  const chartSize = isDesktop ? 280 : 220;
  const radius = chartSize / 2 - 20;
  const innerRadius = radius * 0.6;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  let currentAngle = -90;
  const total = data.reduce((sum, item) => sum + item.population, 0);

  const polarToCartesian = (angle, r) => {
    const angleInRadians = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const createArc = (startAngle, endAngle, outerR, innerR) => {
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const innerStart = polarToCartesian(endAngle, innerR);
    const innerEnd = polarToCartesian(startAngle, innerR);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${start.x} ${start.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      L ${innerStart.x} ${innerStart.y}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}
      Z
    `;
  };

  return (
    <View style={{ flexDirection: isDesktop ? 'row' : 'column', width: '100%' }}>
      {/* Chart on the left - 50% */}
      <View style={{ width: isDesktop ? '50%' : '100%', alignItems: 'center', justifyContent: 'center', paddingRight: isDesktop ? 15 : 0, marginBottom: isDesktop ? 0 : 20 }}>
        <Svg width={chartSize} height={chartSize}>
          <G>
            {data.map((item, index) => {
              const percentage = (item.population / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle = endAngle;

              return (
                <Path
                  key={index}
                  d={createArc(startAngle, endAngle, radius, innerRadius)}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            })}
            <SvgText
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              fontSize={16}
              fontWeight="bold"
              fill="#666"
            >
              {centerText || 'Total'}
            </SvgText>
          </G>
        </Svg>
      </View>
      
      {/* Vertical divider line */}
      {isDesktop && (
        <View style={{ width: 1, backgroundColor: '#e0e0e0', marginHorizontal: 15 }} />
      )}
      
      {/* Data and Percentage on the right - 45% */}
      <View style={{ width: isDesktop ? '45%' : '100%', justifyContent: 'center', paddingLeft: isDesktop ? 15 : 0 }}>
        {data.map((item, index) => {
          const percentage = ((item.population / total) * 100).toFixed(1);
          return (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingVertical: 5, borderBottomWidth: index < data.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}>
              <View style={{ width: 14, height: 14, backgroundColor: item.color, borderRadius: 3, marginRight: 8, flexShrink: 0 }} />
              <View style={{ flex: 1, minWidth: 0, marginRight: 4 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: item.legendFontColor, marginBottom: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={{ fontSize: 13, color: '#888' }} numberOfLines={1} ellipsizeMode="tail">₹{item.population.toLocaleString('en-IN')}</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: item.color, flexShrink: 0, textAlign: 'right' }}>
                {percentage}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function ChartsScreen({ navigation }) {
  const { COLORS, SIZES, FONTS } = useAppTheme();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  useEffect(() => {
    loadChartData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadChartData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadChartData = async () => {
    try {
      const data = await chartAPI.getChartData();
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChartData();
  };

  const getAssetTypeChartData = (data) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
    const result = data.map((item, index) => ({
      name: item.name,
      population: item.value,
      color: colors[index % colors.length],
      legendFontColor: COLORS.text,
      legendFontSize: 16,
    }));
    return result;
  };

  const getAssetChartData = (data) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return data.map((item, index) => ({
      name: item.name,
      population: item.value,
      color: colors[index % colors.length],
      legendFontColor: COLORS.text,
      legendFontSize: 16,
    }));
  };
  };
    return result;
    }));
.Value } 
});
  },
    color: COLORS.textSecondary,
    fontSize: FONTS.medium + 2,
  noDataText: {
  },
    alignItems: 'center',
    padding: 40,
  noDataContainer: {
  },
    marginBottom: 15,
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: FONTS.large + 2,
  sectionTitle: {
  },
    elevation: 3,
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: 20,
    padding: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.surface,
  chartSection: {
  },
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  chartWrapper: {
  },
    padding: SIZES.padding * 1.5,
  cardBody: {
  },
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: FONTS.large + 2,
  cardTitle: {
  },
    fontSize: 22,
  cardHeaderIconText: {
  },
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '20',
    borderRadius: 8,
    height: 36,
    width: 36,
  cardHeaderIcon: {
  },
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    backgroundColor: COLORS.primary + '10',
    padding: SIZES.padding * 1.2,
    alignItems: 'center',
    flexDirection: 'row',
  cardHeader: {
  },
    elevation: 4,
    shadowRadius: 6,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#000',
    borderColor: COLORS.border,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    borderRadius: SIZES.borderRadius * 1.5,
    backgroundColor: COLORS.surface,
  chartCard: {
  },
    padding: SIZES.padding,
    flex: 1,
  content: {
  },
    color: COLORS.textDark,
    fontWeight: 'bold',
    fontSize: FONTS.large + 2,
  headerTitle: {
  },
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    backgroundColor: COLORS.primary,
    paddingBottom: 35,
    paddingTop: 21,
    paddingHorizontal: SIZES.padding,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
  header: {
  },
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  loadingContainer: {
  },
    flex: 1,
  mainContent: {
  },
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    flex: 1,
  container: {
const createStyles = (COLORS, SIZES, FONTS) => StyleSheet.create({

}
  );
    </View>
      </View>
      </ScrollView>
        </View>
          </View>
            )}
              </View>
                <Text style={styles.noDataText}>₹0 | 0%</Text>
              <View style={styles.noDataContainer}>
            ) : (
              />
                centerText="Risk"
                data={getRiskChartData(chartData.riskDistribution)}
              <DoughnutChart
            {chartData?.riskDistribution && chartData.riskDistribution.length > 0 ? (
          <View style={styles.cardBody}>
          </View>
            <Text style={styles.cardTitle}>Risk Distribution</Text>
            </View>
              <Text style={styles.cardHeaderIconText}>⚠️</Text>
            <View style={styles.cardHeaderIcon}>
          <View style={styles.cardHeader}>
        <View style={styles.chartCard}>
        {/* Risk Distribution Chart Card */}

        </View>
          </View>
            )}
              </View>
                <Text style={styles.noDataText}>₹0 | 0%</Text>
              <View style={styles.noDataContainer}>
            ) : (
              />
                centerText="Assets"
                data={getAssetChartData(chartData.assetDistribution)}
              <DoughnutChart
            {chartData?.assetDistribution && chartData.assetDistribution.length > 0 ? (
          <View style={styles.cardBody}>
          </View>
            <Text style={styles.cardTitle}>Asset Distribution</Text>
            </View>
              <Text style={styles.cardHeaderIconText}>💰</Text>
            <View style={styles.cardHeaderIcon}>
          <View style={styles.cardHeader}>
        <View style={styles.chartCard}>
        {/* Asset Distribution Chart Card */}

        </View>
          </View>
            )}
              </View>
                <Text style={styles.noDataText}>₹0 | 0%</Text>
              <View style={styles.noDataContainer}>
            ) : (
              />
                centerText="Asset Type"
                data={getAssetTypeChartData(chartData.investmentTypeDistribution)}
              <DoughnutChart
            {chartData?.investmentTypeDistribution && chartData.investmentTypeDistribution.length > 0 ? (
          <View style={styles.cardBody}>
          </View>
            <Text style={styles.cardTitle}>Asset Type Distribution</Text>
            </View>
              <Text style={styles.cardHeaderIconText}>📊</Text>
            <View style={styles.cardHeaderIcon}>
          <View style={styles.cardHeader}>
        <View style={styles.chartCard}>
        {/* Asset Type Distribution Chart Card */}
        >
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.content}
        <ScrollView

        </View>
          <Text style={styles.headerTitle}>Charts</Text>
        <View style={styles.header}>
      <View style={styles.mainContent}>
      
      {isDesktop && <Sidebar navigation={navigation} currentRoute="Charts" />}
    <View style={styles.container}>
  return (

  }
    );
      </View>
        <ActivityIndicator size="large" color={COLORS.primary} />
      <View style={styles.loadingContainer}>
    return (
  if (loading) {

  };
    }));
      legendFontSize: 16,
      legendFontColor: COLORS.text,
      color: riskColors[item.name] || '#999999',
      population: item.value,
      name: item.name,
    return data.map((item) => ({
    };
      'High': '#F44336'
      'Moderate': '#FFC107',
      'Low': '#4CAF50',
    const riskColors = {
  const getRiskChartData = (data) => {

  };
    }));
      legendFontSize: 16,
      legendFontColor: COLORS.text,
      color: colors[index % colors.length],
      population: item.value,
      name: item.name,
    return data.map((item, index) => ({
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const getAssetChartData = (data) => {

  };
    return result;
    }));
      legendFontSize: 16,
      legendFontColor: COLORS.text,
      color: colors[index % colors.length],
      population: item.value,
      name: item.name,
    const result = data.map((item, index) => ({
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
  const getAssetTypeChartData = (data) => {

  };
    loadChartData();
    setRefreshing(true);
  const onRefresh = () => {

  };
    }
      setRefreshing(false);
      setLoading(false);
    } finally {
      console.error('Error loading chart data:', error);
    } catch (error) {
      setChartData(data);
      const data = await chartAPI.getChartData();
    try {
  const loadChartData = async () => {

  }, [navigation]);
    return unsubscribe;
    });
      loadChartData();
    const unsubscribe = navigation.addListener('focus', () => {
  useEffect(() => {

  }, []);
    loadChartData();
  useEffect(() => {

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const { COLORS, SIZES, FONTS } = useAppTheme();
export default function ChartsScreen({ navigation }) {

};
  );
    </View>
      </View>
        })}
          );
            </View>
              </Text>
                {percentage}%
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: item.color, flexShrink: 0, textAlign: 'right' }}>
              </View>
                <Text style={{ fontSize: 13, color: '#888' }} numberOfLines={1} ellipsizeMode="tail">₹{item.population.toLocaleString('en-IN')}</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: item.legendFontColor, marginBottom: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <View style={{ flex: 1, minWidth: 0, marginRight: 4 }}>
              <View style={{ width: 14, height: 14, backgroundColor: item.color, borderRadius: 3, marginRight: 8, flexShrink: 0 }} />
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingVertical: 5, borderBottomWidth: index < data.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}>
          return (
          const percentage = ((item.population / total) * 100).toFixed(1);
        {data.map((item, index) => {
      <View style={{ width: isDesktop ? '45%' : '100%', justifyContent: 'center', paddingLeft: isDesktop ? 15 : 0 }}>
      {/* Data and Percentage on the right - 45% */}
      
      )}
        <View style={{ width: 1, backgroundColor: '#e0e0e0', marginHorizontal: 15 }} />
      {isDesktop && (
      {/* Vertical divider line */}
      
      </View>
        </Svg>
          </G>
            </SvgText>
              {centerText || 'Total'}
            >
              fill="#666"
              fontWeight="bold"
              fontSize={16}
              textAnchor="middle"
              y={centerY + 5}
              x={centerX}
            <SvgText
            })}
              );
                />
                  strokeWidth={2}
                  stroke="#fff"
                  fill={item.color}
                  d={createArc(startAngle, endAngle, radius, innerRadius)}
                  key={index}
                <Path
              return (

              currentAngle = endAngle;
              const endAngle = currentAngle + angle;
              const startAngle = currentAngle;
              const angle = (percentage / 100) * 360;
              const percentage = (item.population / total) * 100;
            {data.map((item, index) => {
          <G>
        <Svg width={chartSize} height={chartSize}>
      <View style={{ width: isDesktop ? '50%' : '100%', alignItems: 'center', justifyContent: 'center', paddingRight: isDesktop ? 15 : 0, marginBottom: isDesktop ? 0 : 20 }}>
      {/* Chart on the left - 50% */}
    <View style={{ flexDirection: isDesktop ? 'row' : 'column', width: '100%' }}>
  return (

  };
    `;
      Z
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}
      L ${innerStart.x} ${innerStart.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      M ${start.x} ${start.y}
    return `

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    const innerEnd = polarToCartesian(startAngle, innerR);
    const innerStart = polarToCartesian(endAngle, innerR);
    const end = polarToCartesian(endAngle, outerR);
    const start = polarToCartesian(startAngle, outerR);
  const createArc = (startAngle, endAngle, outerR, innerR) => {

  };
    };
      y: centerY + r * Math.sin(angleInRadians),
      x: centerX + r * Math.cos(angleInRadians),
    return {
    const angleInRadians = (angle * Math.PI) / 180;
  const polarToCartesian = (angle, r) => {

  const total = data.reduce((sum, item) => sum + item.population, 0);
  let currentAngle = -90;

  const centerY = chartSize / 2;
  const centerX = chartSize / 2;
  const innerRadius = radius * 0.6;
  const radius = chartSize / 2 - 20;
  const chartSize = isDesktop ? 280 : 220;
  
  }
    return null;
  if (!data || data.length === 0) {
const DoughnutChart = ({ data, centerText }) => {
// Custom Doughnut Chart Component

const isDesktop = screenWidth > 768;
const screenWidth = Dimensions.get('window').width;

import Sidebar from '../components/Sidebar';
import { useAppTheme } from '../utils/useAppTheme';
import { chartAPI } from '../services/api';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { PieChart } from 'react-native-chart-kit';
} from 'react-native';
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
import {
       
      legendFontColor: COLORS.text,
      color: colors[index % colors.length],
      population: item.value,
      name: item.name,
    const result = data.map((item, index) => ({
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
  const getAssetTypeChartData = (data) => {

  };
    loadChartData();
    setRefreshing(true);
  const onRefresh = () => {

  };
    }
      setRefreshing(false);
      setLoading(false);
    } finally {
      console.error('Error loading chart data:', error);
    } catch (error) {
      setChartData(data);
      const data = await chartAPI.getChartData();
    try {
  const loadChartData = async () => {

  }, [navigation]);
    return unsubscribe;
    });
      loadChartData();
    const unsubscribe = navigation.addListener('focus', () => {
  useEffect(() => {

  }, []);
    loadChartData();
  useEffect(() => {

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const { COLORS, SIZES, FONTS } = useAppTheme();
export default function ChartsScreen({ navigation }) {

};
  );
    </View>
      </View>
        })}
          );
            </View>
              </Text>
                {percentage}%
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: item.color, flexShrink: 0, textAlign: 'right' }}>
              </View>
                <Text style={{ fontSize: 13, color: '#888' }} numberOfLines={1} ellipsizeMode="tail">₹{item.population.toLocaleString('en-IN')}</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: item.legendFontColor, marginBottom: 1 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <View style={{ flex: 1, minWidth: 0, marginRight: 4 }}>
              <View style={{ width: 14, height: 14, backgroundColor: item.color, borderRadius: 3, marginRight: 8, flexShrink: 0 }} />
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingVertical: 5, borderBottomWidth: index < data.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}>
          return (
          const percentage = ((item.population / total) * 100).toFixed(1);
        {data.map((item, index) => {
      <View style={{ width: isDesktop ? '45%' : '100%', justifyContent: 'center', paddingLeft: isDesktop ? 15 : 0 }}>
      {/* Data and Percentage on the right - 45% */}
      
      )}
        <View style={{ width: 1, backgroundColor: '#e0e0e0', marginHorizontal: 15 }} />
      {isDesktop && (
      {/* Vertical divider line */}
      
      </View>
        </Svg>
          </G>
            </SvgText>
              {centerText || 'Total'}
            >
              fill="#666"
              fontWeight="bold"
              fontSize={16}
              textAnchor="middle"
              y={centerY + 5}
              x={centerX}
            <SvgText
            })}
              );
                />
                  strokeWidth={2}
                  stroke="#fff"
                  fill={item.color}
                  d={createArc(startAngle, endAngle, radius, innerRadius)}
                  key={index}
                <Path
              return (

              currentAngle = endAngle;
              const endAngle = currentAngle + angle;
              const startAngle = currentAngle;
              const angle = (percentage / 100) * 360;
              const percentage = (item.population / total) * 100;
            {data.map((item, index) => {
          <G>
        <Svg width={chartSize} height={chartSize}>
      <View style={{ width: isDesktop ? '50%' : '100%', alignItems: 'center', justifyContent: 'center', paddingRight: isDesktop ? 15 : 0, marginBottom: isDesktop ? 0 : 20 }}>
      {/* Chart on the left - 50% */}
    <View style={{ flexDirection: isDesktop ? 'row' : 'column', width: '100%' }}>
  return (

  };
    `;
      Z
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}
      L ${innerStart.x} ${innerStart.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
      M ${start.x} ${start.y}
    return `

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    const innerEnd = polarToCartesian(startAngle, innerR);
    const innerStart = polarToCartesian(endAngle, innerR);
    const end = polarToCartesian(endAngle, outerR);
    const start = polarToCartesian(startAngle, outerR);
  const createArc = (startAngle, endAngle, outerR, innerR) => {

  };
    };
      y: centerY + r * Math.sin(angleInRadians),
      x: centerX + r * Math.cos(angleInRadians),
    return {
    const angleInRadians = (angle * Math.PI) / 180;
  const polarToCartesian = (angle, r) => {

  const total = data.reduce((sum, item) => sum + item.population, 0);
  let currentAngle = -90;

  const centerY = chartSize / 2;
  const centerX = chartSize / 2;
  const innerRadius = radius * 0.6;
  const radius = chartSize / 2 - 20;
  const chartSize = isDesktop ? 280 : 220;
  
  }
    return null;
  if (!data || data.length === 0) {
const DoughnutChart = ({ data, centerText }) => {
// Custom Doughnut Chart Component

const isDesktop = screenWidth > 768;
const screenWidth = Dimensions.get('window').width;

import Sidebar from '../components/Sidebar';
import { useAppTheme } from '../utils/useAppTheme';
import { chartAPI } from '../services/api';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { PieChart } from 'react-native-chart-kit';
} from 'react-native';
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
import {
import React, { useState, useEffect, useMemo } from 'react';

