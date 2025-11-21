# Update ChartsScreen.js with Picker, centered modal, and toast
$chartsContent = @"
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { chartAPI } from '../services/api';
import { useTheme, SIZES, FONTS } from '../context/ThemeContext';
import Toast from '../components/Toast';

const screenWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push({ label: i.toString(), value: i });
  }
  return years;
};

export default function ChartsScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    amount: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

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
      showToast('Failed to load chart data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChartData();
  };

  const openAddModal = () => {
    const now = new Date();
    setFormData({
      amount: '',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });
    setModalVisible(true);
  };

  const handleAddEntry = async () => {
    if (!formData.amount) {
      showToast('Please enter an amount', 'error');
      return;
    }

    try {
      const selectedMonth = MONTHS.find(m => m.value === formData.month);
      const monthName = \`\${selectedMonth.label.substr(0, 3)} \${formData.year}\`;
      
      await chartAPI.createMonthlyEntry({
        monthName,
        amount: parseFloat(formData.amount),
        year: formData.year,
        month: formData.month,
      });

      setModalVisible(false);
      loadChartData();
      showToast('Entry added successfully');
    } catch (error) {
      console.error('Error adding entry:', error);
      showToast('Failed to add entry', 'error');
    }
  };

  const openEditModal = (entry) => {
    setCurrentEntry(entry);
    setFormData({
      amount: entry.amount.toString(),
      year: entry.year,
      month: entry.month,
    });
    setEditModalVisible(true);
  };

  const handleUpdateEntry = async () => {
    if (!formData.amount) {
      showToast('Please enter an amount', 'error');
      return;
    }

    try {
      await chartAPI.updateMonthlyEntry(currentEntry.id, {
        amount: parseFloat(formData.amount),
      });

      setEditModalVisible(false);
      loadChartData();
      showToast('Entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      showToast('Failed to update entry', 'error');
    }
  };

  const handleDeleteEntry = (entry) => {
    if (window.confirm(\`Are you sure you want to delete \${entry.monthName}?\`)) {
      deleteEntry(entry.id);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await chartAPI.deleteMonthlyEntry(id);
      loadChartData();
      showToast('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      showToast('Failed to delete entry', 'error');
    }
  };

  const getBarChartData = () => {
    if (!chartData?.monthlyData || chartData.monthlyData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    const last6Months = chartData.monthlyData.slice(-6);
    return {
      labels: last6Months.map((item) => item.monthName.split(' ')[0]),
      datasets: [
        {
          data: last6Months.map((item) => item.amount),
        },
      ],
    };
  };

  const getPieChartData = (data) => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      name: \`\${item.name} (\${item.percentage}%)\`,
      population: item.value,
      color: item.color,
      legendFontColor: colors.text,
      legendFontSize: FONTS.regular,
    }));
  };

  const styles = getStyles(colors, isWeb);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { color: colors.textDark }]}>Charts</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.innerContainer}>
          {/* Bar Chart Section */}
          <View style={[styles.chartSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Tracking</Text>
              <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                <Ionicons name="add-circle" size={28} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {chartData?.monthlyData && chartData.monthlyData.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={getBarChartData()}
                  width={Math.max(isWeb ? 600 : screenWidth - 80, chartData.monthlyData.slice(-6).length * 60)}
                  height={220}
                  yAxisLabel="₹"
                  chartConfig={{
                    backgroundColor: colors.primary,
                    backgroundGradientFrom: colors.primary,
                    backgroundGradientTo: colors.primaryDark,
                    decimalPlaces: 0,
                    color: (opacity = 1) => \`rgba(255, 255, 255, \${opacity})\`,
                    labelColor: (opacity = 1) => \`rgba(255, 255, 255, \${opacity})\`,
                    style: {
                      borderRadius: SIZES.borderRadius,
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: '',
                    },
                  }}
                  style={styles.chart}
                  fromZero
                />
              </ScrollView>
            ) : (
              <View style={[styles.noDataContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No monthly data yet</Text>
              </View>
            )}

            {/* Monthly Data Table */}
            {chartData?.monthlyData && chartData.monthlyData.length > 0 && (
              <View style={[styles.dataTable, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.tableHeader, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.tableHeaderText, { flex: 2, color: colors.textDark }]}>Month</Text>
                  <Text style={[styles.tableHeaderText, { flex: 2, color: colors.textDark }]}>Amount</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1, color: colors.textDark }]}>Actions</Text>
                </View>
                {chartData.monthlyData.map((entry) => (
                  <View key={entry.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.tableCell, { flex: 2, color: colors.text }]}>{entry.monthName}</Text>
                    <Text style={[styles.tableCell, { flex: 2, color: colors.text }]}>₹{entry.amount.toLocaleString()}</Text>
                    <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', gap: 5 }]}>
                      <TouchableOpacity onPress={() => openEditModal(entry)}>
                        <Ionicons name="pencil" size={20} color={colors.info} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteEntry(entry)}>
                        <Ionicons name="trash" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Asset Distribution Pie Chart */}
          <View style={[styles.chartSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Asset Distribution</Text>
            {chartData?.assetDistribution && chartData.assetDistribution.length > 0 ? (
              <PieChart
                data={getPieChartData(chartData.assetDistribution)}
                width={isWeb ? 600 : screenWidth - 80}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => \`rgba(0, 0, 0, \${opacity})\`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={[styles.noDataContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No asset data yet</Text>
              </View>
            )}
          </View>

          {/* Risk Distribution Pie Chart */}
          <View style={[styles.chartSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk Distribution</Text>
            {chartData?.riskDistribution && chartData.riskDistribution.length > 0 ? (
              <PieChart
                data={getPieChartData(chartData.riskDistribution)}
                width={isWeb ? 600 : screenWidth - 80}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => \`rgba(0, 0, 0, \${opacity})\`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={[styles.noDataContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No risk data yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Entry Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Monthly Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Month</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Picker
                selectedValue={formData.month}
                onValueChange={(value) => setFormData({ ...formData, month: value })}
                style={[styles.picker, { color: colors.text }]}
              >
                {MONTHS.map((month) => (
                  <Picker.Item key={month.value} label={month.label} value={month.value} />
                ))}
              </Picker>
            </View>

            <Text style={[styles.label, { color: colors.text }]}>Year</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Picker
                selectedValue={formData.year}
                onValueChange={(value) => setFormData({ ...formData, year: value })}
                style={[styles.picker, { color: colors.text }]}
              >
                {getYearOptions().map((year) => (
                  <Picker.Item key={year.value} label={year.label} value={year.value} />
                ))}
              </Picker>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
            />

            <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleAddEntry}>
              <Text style={[styles.submitButtonText, { color: colors.textDark }]}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Entry</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.monthLabel, { color: colors.primary }]}>
              {currentEntry && currentEntry.monthName}
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="Amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
            />

            <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleUpdateEntry}>
              <Text style={[styles.submitButtonText, { color: colors.textDark }]}>Update Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors, isWeb) => StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: isWeb ? 20 : 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: isWeb ? 1200 : '100%',
    paddingHorizontal: SIZES.padding,
  },
  chartSection: {
    padding: SIZES.padding,
    marginBottom: 20,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
  },
  addButton: {
    marginBottom: 0,
  },
  chart: {
    marginVertical: 8,
    borderRadius: SIZES.borderRadius,
  },
  noDataContainer: {
    padding: 40,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    borderWidth: 1,
  },
  noDataText: {
    fontSize: FONTS.medium,
  },
  dataTable: {
    borderRadius: SIZES.borderRadius,
    marginTop: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
  },
  tableHeaderText: {
    fontSize: FONTS.regular,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: FONTS.regular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: isWeb ? 500 : '90%',
    maxWidth: 500,
    borderRadius: 20,
    padding: SIZES.padding * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
  },
  monthLabel: {
    fontSize: FONTS.large,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: SIZES.borderRadius,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    fontSize: FONTS.medium,
    marginBottom: 15,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
  },
});
"@

$chartsContent | Out-File -FilePath "C:\MoneyManager\Frontend\src\screens\ChartsScreen.js" -Encoding utf8 -Force

Write-Host "Updated ChartsScreen.js" -ForegroundColor Green
