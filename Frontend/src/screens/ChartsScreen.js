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
              fontSize={15}
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
      legendFontSize: 17,
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
      legendFontSize: 17,
    }));
  };

  const getRiskChartData = (data) => {
    const riskColors = { 'Low': '#4CAF50', 'Moderate': '#FFC107', 'High': '#F44336' };
    return data.map((item) => ({
      name: item.name,
      population: item.value,
      color: riskColors[item.name] || '#999999',
      legendFontColor: COLORS.text,
      legendFontSize: 17,
    }));
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
      {isDesktop && <Sidebar navigation={navigation} currentRoute="Charts" />}
      
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Charts</Text>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
        {/* Asset Type Distribution Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIcon}>
              <Text style={styles.cardHeaderIconText}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Asset Type Distribution</Text>
          </View>
          <View style={styles.cardBody}>
            {chartData?.investmentTypeDistribution && chartData.investmentTypeDistribution.length > 0 ? (
              <DoughnutChart
                data={getAssetTypeChartData(chartData.investmentTypeDistribution)}
                centerText="Asset Type"
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>₹0 | 0%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Asset Distribution Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIcon}>
              <Text style={styles.cardHeaderIconText}>💰</Text>
            </View>
            <Text style={styles.cardTitle}>Asset Distribution</Text>
          </View>
          <View style={styles.cardBody}>
            {chartData?.assetDistribution && chartData.assetDistribution.length > 0 ? (
              <DoughnutChart
                data={getAssetChartData(chartData.assetDistribution)}
                centerText="Assets"
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>₹0 | 0%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Risk Distribution Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIcon}>
              <Text style={styles.cardHeaderIconText}>⚠️</Text>
            </View>
            <Text style={styles.cardTitle}>Risk Distribution</Text>
          </View>
          <View style={styles.cardBody}>
            {chartData?.riskDistribution && chartData.riskDistribution.length > 0 ? (
              <DoughnutChart
                data={getRiskChartData(chartData.riskDistribution)}
                centerText="Risk"
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>₹0 | 0%</Text>
              </View>
            )}
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
    paddingBottom: 30,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.large + 2,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius * 1.5,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding * 1.2,
    backgroundColor: COLORS.primary + '10',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderIconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: FONTS.large + 2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardBody: {
    padding: SIZES.padding * 1.5,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  chartSection: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: FONTS.medium + 2,
    color: COLORS.textSecondary,
  },
});

