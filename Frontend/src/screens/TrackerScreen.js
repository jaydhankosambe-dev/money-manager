import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from '../components/Icon';
import { BarChart } from 'react-native-chart-kit';
import { chartAPI, settingsAPI } from '../services/api';
import { useAppTheme } from '../utils/useAppTheme';
import Sidebar from '../components/Sidebar';
import { formatIndianCurrency } from '../utils/formatCurrency';

const screenWidth = Dimensions.get('window').width;
const isDesktop = screenWidth > 768;

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

export default function TrackerScreen({ navigation }) {
  const { COLORS, SIZES, FONTS } = useAppTheme();
  const [chartData, setChartData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [editMonthDropdownOpen, setEditMonthDropdownOpen] = useState(false);
  const [editYearDropdownOpen, setEditYearDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    monthName: '',
    amount: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

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
      const [data, settingsData] = await Promise.all([
        chartAPI.getChartData(),
        settingsAPI.getSettings()
      ]);
      setChartData(data);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading chart data:', error);
      Alert.alert('Error', 'Failed to load chart data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChartData();
  };

  const openAddModal = () => {
    const now = new Date();
    setFormData({
      monthName: '',
      amount: '',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });
    setModalVisible(true);
  };

  const handleAddEntry = async () => {
    
    if (!formData.amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    try {
      const selectedMonth = MONTHS.find(m => m.value === formData.month);
      const monthName = `${selectedMonth.label.substring(0, 3)} ${formData.year}`;
      
      const result = await chartAPI.createMonthlyEntry({
        monthName,
        amount: parseFloat(formData.amount),
        year: formData.year,
        month: formData.month,
      });

      setModalVisible(false);
      loadChartData();
      Alert.alert('Success', 'Entry added successfully');
    } catch (error) {
      console.error('Error adding entry:', error);
      console.error('Error details:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add entry: ' + (error.response?.data?.message || error.message));
    }
  };

  const openEditModal = (entry) => {
    setCurrentEntry(entry);
    setFormData({
      monthName: entry.monthName,
      amount: entry.amount.toString(),
      year: entry.year,
      month: entry.month,
    });
    setEditModalVisible(true);
  };

  const handleUpdateEntry = async () => {
    if (!formData.amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    try {
      const selectedMonth = MONTHS.find(m => m.value === formData.month);
      const monthName = `${selectedMonth.label.substring(0, 3)} ${formData.year}`;

      await chartAPI.updateMonthlyEntry(currentEntry.id, {
        monthName,
        amount: parseFloat(formData.amount),
        year: formData.year,
        month: formData.month,
      });

      setEditModalVisible(false);
      loadChartData();
      Alert.alert('Success', 'Entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update entry');
    }
  };

  const handleDelete = (entry) => {
    setEntryToDelete(entry);
    setDeleteModalVisible(true);
  };

  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;
    
    try {
      await chartAPI.deleteMonthlyEntry(entryToDelete.id);
      
      // Reload chart data
      const freshData = await chartAPI.getChartData();
      setChartData(freshData);
      
      setDeleteModalVisible(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert(`Failed to delete entry: ${error.message}`);
    }
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
    };
    return colors[scheme] || colors.Blue;
  };

  const formatAmount = (amount) => {
    return formatIndianCurrency(amount);
  };

  const getBarChartData = () => {
    if (!chartData?.monthlyData || chartData.monthlyData.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }

    const sortedData = [...chartData.monthlyData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return {
      labels: sortedData.map((item) => item.monthName),
      datasets: [{ data: sortedData.map((item) => item.amount) }],
    };
  };

  const getChartWidth = () => {
    const barCount = chartData?.monthlyData ? chartData.monthlyData.length : 2;
    const barWidth = 60; // Fixed bar width in pixels
    const barSpacing = 25; // Fixed spacing between bars in pixels
    const padding = 80; // Left and right padding for labels and axis
    return (barCount * barWidth) + ((barCount - 1) * barSpacing) + padding;
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
      {isDesktop && <Sidebar navigation={navigation} currentRoute="Tracker" />}
      
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Monthly Tracker</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={openAddModal}
            accessibilityLabel="Add"
            accessibilityHint="Add new monthly entry" title="Add"
          >
            <Icon name="add" size={18} color="#FFFFFF" title="Add" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
        {/* Bar Chart Section */}
        <View style={styles.chartPanel}>
          <Text style={styles.sectionTitle}>Monthly Tracking Chart</Text>

          {chartData?.monthlyData && chartData.monthlyData.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={getBarChartData()}
                width={getChartWidth()}
                height={220}
                yAxisLabel="₹"
                yAxisSuffix=""
                formatYLabel={(value) => formatAmount(parseFloat(value))}
                chartConfig={{
                  backgroundColor: COLORS.surface,
                  backgroundGradientFrom: COLORS.surface,
                  backgroundGradientTo: COLORS.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => getSchemeColor(settings?.dashboardColorScheme || 'Blue'),
                  fillShadowGradient: getSchemeColor(settings?.dashboardColorScheme || 'Blue'),
                  fillShadowGradientOpacity: 1,
                  labelColor: (opacity = 1) => COLORS.text,
                  propsForLabels: {
                    fontSize: 13,
                  },
                  style: {
                    borderRadius: SIZES.borderRadius,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: COLORS.border,
                    strokeWidth: 1,
                  },
                  barRadius: 4,
                }}
                style={styles.chart}
                fromZero
                withInnerLines={true}
                showBarTops={false}
              />
            </ScrollView>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No monthly data yet</Text>
            </View>
          )}
        </View>

        {/* Monthly Data Table */}
        {chartData?.monthlyData && chartData.monthlyData.length > 0 && (
          <View style={styles.dataPanel}>
            <Text style={styles.sectionTitle}>Monthly Data</Text>
            <View style={styles.dataTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Month</Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Amount</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
              </View>
              {chartData.monthlyData.map((entry) => (
                <View key={entry.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{entry.monthName}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>₹{formatIndianCurrency(entry.amount)}</Text>
                  <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', gap: 8 }]}>
                    <TouchableOpacity 
                      onPress={() => openEditModal(entry)}
                      style={styles.actionButtonEdit}
                      accessibilityLabel="Edit"
                      accessibilityHint="Edit this entry" title="Edit"
>
                      <Icon name="pencil" size={18} color={COLORS.textDark} title="Edit" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteEntry(entry)}
                      style={styles.actionButtonDelete}
                      accessibilityLabel="Delete"
                      accessibilityHint="Delete this entry" title="Delete"
>
                      <Icon name="trash" size={18} color={COLORS.textDark} title="Delete" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Entry Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Monthly Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Select Month</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setMonthDropdownOpen(!monthDropdownOpen)}
              >
                <Text style={styles.dropdownButtonText}>
                  {MONTHS.find(m => m.value === formData.month)?.label || 'Select Month'}
                </Text>
                <Icon 
                  name={monthDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
              {monthDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {MONTHS.map((month) => (
                      <TouchableOpacity
                        key={month.value}
                        style={[
                          styles.dropdownItem,
                          formData.month === month.value && styles.dropdownItemActive
                        ]}
                        onPress={() => {
                          setFormData({ ...formData, month: month.value });
                          setMonthDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          formData.month === month.value && styles.dropdownItemTextActive
                        ]}>
                          {month.label}
                        </Text>
                        {formData.month === month.value && (
                          <Icon name="checkmark" size={20} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.label}>Select Year</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setYearDropdownOpen(!yearDropdownOpen)}
              >
                <Text style={styles.dropdownButtonText}>
                  {formData.year}
                </Text>
                <Icon 
                  name={yearDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
              {yearDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                    {getYearOptions().map((year) => (
                      <TouchableOpacity
                        key={year.value}
                        style={[
                          styles.dropdownItem,
                          formData.year === year.value && styles.dropdownItemActive
                        ]}
                        onPress={() => {
                          setFormData({ ...formData, year: year.value });
                          setYearDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          formData.year === year.value && styles.dropdownItemTextActive
                        ]}>
                          {year.label}
                        </Text>
                        {formData.year === year.value && (
                          <Icon name="checkmark" size={20} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Amount (₹)"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleAddEntry}>
                <Text style={styles.submitButtonText}>Add Entry</Text>
              </TouchableOpacity>
            </ScrollView>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Monthly Entry</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={28} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
              <Text style={styles.label}>Select Month</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  setEditMonthDropdownOpen(!editMonthDropdownOpen);
                  setEditYearDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {MONTHS.find(m => m.value === formData.month)?.label || 'Select Month'}
                </Text>
                <Icon 
                  name={editMonthDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
              {editMonthDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {MONTHS.map((month) => (
                      <TouchableOpacity
                        key={month.value}
                        style={[
                          styles.dropdownItem,
                          formData.month === month.value && styles.dropdownItemActive
                        ]}
                        onPress={() => {
                          setFormData({ ...formData, month: month.value });
                          setEditMonthDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          formData.month === month.value && styles.dropdownItemTextActive
                        ]}>
                          {month.label}
                        </Text>
                        {formData.month === month.value && (
                          <Icon name="checkmark" size={20} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.label}>Select Year</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  setEditYearDropdownOpen(!editYearDropdownOpen);
                  setEditMonthDropdownOpen(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {formData.year}
                </Text>
                <Icon 
                  name={editYearDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
              {editYearDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {getYearOptions().map((year) => (
                      <TouchableOpacity
                        key={year.value}
                        style={[
                          styles.dropdownItem,
                          formData.year === year.value && styles.dropdownItemActive
                        ]}
                        onPress={() => {
                          setFormData({ ...formData, year: year.value });
                          setEditYearDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          formData.year === year.value && styles.dropdownItemTextActive
                        ]}>
                          {year.label}
                        </Text>
                        {formData.year === year.value && (
                          <Icon name="checkmark" size={20} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Amount (₹)"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleUpdateEntry}>
                <Text style={styles.submitButtonText}>Update Entry</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Entry</Text>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Icon name="close" size={28} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              <Text style={[styles.label, { marginBottom: 20, fontSize: FONTS.medium }]}>
                Are you sure you want to delete {entryToDelete?.monthName}?
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: COLORS.textSecondary, flex: 1 }]}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: '#dc3545', flex: 1 }]}
                  onPress={confirmDeleteEntry}
                >
                  <Text style={styles.submitButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 28,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  addButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  chartPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius * 1.5,
    padding: SIZES.padding * 1.5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  dataPanel: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius * 1.5,
    padding: SIZES.padding * 1.5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
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
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: SIZES.borderRadius,
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: FONTS.medium,
    color: COLORS.textSecondary,
  },
  dataTable: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary + '20',
    borderRadius: SIZES.borderRadius,
  },
  tableHeaderText: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  actionButtonEdit: {
    backgroundColor: COLORS.info,
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.info,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonDelete: {
    backgroundColor: COLORS.error,
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.padding * 2,
    width: isDesktop ? 500 : '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  label: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 10,
  },
  dropdownButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: FONTS.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    marginTop: -10,
    marginBottom: 20,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 250,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemActive: {
    backgroundColor: COLORS.primary + '15',
  },
  dropdownItemText: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  dropdownItemTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    fontSize: FONTS.medium,
    color: COLORS.text,
    marginBottom: 20,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.textDark,
    letterSpacing: 0.5,
  },
});
