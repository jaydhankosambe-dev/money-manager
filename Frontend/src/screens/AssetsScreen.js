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
import { assetAPI, settingsAPI } from '../services/api';
import { useAppTheme } from '../utils/useAppTheme';
import Sidebar from '../components/Sidebar';

const windowWidth = Dimensions.get('window').width;
const isDesktop = windowWidth> 768;

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

export default function AssetsScreen({ navigation }) {
  const { COLORS, SIZES, FONTS } = useAppTheme();
  const [assets, setAssets] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    targetAmount: '',
    investmentType: 'Liquid',
    riskCategory: 'Low',
  });

  const styles = useMemo(() => createStyles(COLORS, SIZES, FONTS), [COLORS, SIZES, FONTS]);

  const loadAssets = React.useCallback(async () => {
    try {
      const [assetsData, settingsData] = await Promise.all([
        assetAPI.getAll(),
        settingsAPI.getSettings()
      ]);
      setAssets(assetsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading assets:', error);
      Alert.alert('Error', 'Failed to load assets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAssets);
    return unsubscribe;
  }, [navigation, loadAssets]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAssets();
  }, [loadAssets]);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentAsset(null);
    setFormData({
      name: '',
      amount: '',
      targetAmount: '',
      investmentType: 'Liquid',
      riskCategory: 'Low',
    });
    setModalVisible(true);
  };

  const openEditModal = (asset) => {
    setEditMode(true);
    setCurrentAsset(asset);
    setFormData({
      name: asset.name,
      amount: asset.amount.toString(),
      targetAmount: asset.targetAmount ? asset.targetAmount.toString() : '',
      investmentType: asset.investmentType,
      riskCategory: asset.riskCategory,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const data = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
        investmentType: formData.investmentType,
        riskCategory: formData.riskCategory,
      };

      if (editMode && currentAsset) {
        await assetAPI.update(currentAsset.id, data);
      } else {
        await assetAPI.create(data);
      }

      setModalVisible(false);
      loadAssets();
      Alert.alert('Success', `Asset ${editMode ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving asset:', error);
      Alert.alert('Error', 'Failed to save asset');
    }
  };

  const handleDelete = (asset) => {
    setAssetToDelete(asset);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    
    try {
      await assetAPI.delete(assetToDelete.id);
      await loadAssets();
      
      setDeleteModalVisible(false);
      setAssetToDelete(null);
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert(`Failed to delete asset: ${error.message}`);
    }
  };

  const renderAssetGrid = () => {
    if (!assets || assets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No assets yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first asset</Text>
        </View>
      );
    }

    const sortedAssets = [...assets].sort((a, b) => b.percentage - a.percentage);

    return (
      <View style={styles.gridContainer}>
        <View style={styles.gridHeader}>
          <Text style={[styles.gridHeaderText, { flex: 2.5 }]}>Name</Text>
          <Text style={[styles.gridHeaderText, { flex: 2 }]}>Amount</Text>
          <Text style={[styles.gridHeaderText, { flex: 2 }]}>Target Amount</Text>
          <Text style={[styles.gridHeaderText, { flex: 1.2 }]}>Percentage</Text>
          <Text style={[styles.gridHeaderText, { flex: 1.5 }]}>Asset Type</Text>
          <Text style={[styles.gridHeaderText, { flex: 1.5 }]}>Risk</Text>
          <Text style={[styles.gridHeaderText, { flex: 1.2 }]}>Actions</Text>
        </View>
        {sortedAssets.map((asset) => (
          <View key={asset.id} style={styles.gridRow}>
            <Text style={[styles.gridCell, { flex: 2.5 }]} numberOfLines={1}>{asset.name}</Text>
            <Text style={[styles.gridCell, { flex: 2 }]}>₹{formatIndianCurrency(asset.amount)}</Text>
            <Text style={[styles.gridCell, { flex: 2 }]}>
              {asset.targetAmount ? `₹${formatIndianCurrency(asset.targetAmount)}` : '-'}
            </Text>
            <Text style={[styles.gridCell, { flex: 1.2 }]}>{asset.percentage}%</Text>
            <View style={[styles.gridCell, { flex: 1.5, alignItems: 'flex-start' }]}>
              <View style={[
                styles.typeBadge,
                { backgroundColor: asset.investmentType === 'Invested' ? COLORS.invested : asset.investmentType === 'Liquid' ? COLORS.liquid : COLORS.lend }
              ]}>
                <Text style={styles.typeBadgeText}>{asset.investmentType}</Text>
              </View>
            </View>
            <View style={[styles.gridCell, { flex: 1.5, alignItems: 'flex-start' }]}>
              <View style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    asset.riskCategory === 'Low' ? COLORS.lowRisk :
                    asset.riskCategory === 'Moderate' ? COLORS.moderateRisk :
                    COLORS.highRisk
                }
              ]}>
                <Text style={styles.typeBadgeText}>{asset.riskCategory}</Text>
              </View>
            </View>
            <View style={{ flex: 1.2, flexDirection: 'row', gap: 8, justifyContent: 'flex-start', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => openEditModal(asset)} style={styles.actionButtonEdit}>
                <Icon name="pencil" size={18} color={COLORS.textDark} title="Edit" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(asset)} style={styles.actionButtonDelete}>
                <Icon name="trash" size={18} color={COLORS.textDark} title="Delete" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderAssetTiles = () => {
    if (!assets || assets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No assets yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first asset</Text>
        </View>
      );
    }

    const sortedAssets = [...assets].sort((a, b) => b.percentage - a.percentage);

    return (
      <View style={styles.tilesContainer}>
        {sortedAssets.map((asset) => (
          <View key={asset.id} style={styles.tileCard}>
            <View style={styles.tileHeader}>
              <Text style={styles.tileName}>{asset.name}</Text>
              <View style={styles.tileActions}>
                <TouchableOpacity onPress={() => openEditModal(asset)} style={styles.actionButtonEdit} accessibilityLabel="Edit" accessibilityHint="Edit this asset" title="Edit">
                  <Icon name="pencil" size={18} color={COLORS.textDark} title="Edit" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(asset)} style={styles.actionButtonDelete} accessibilityLabel="Delete" accessibilityHint="Delete this asset" title="Delete">
                  <Icon name="trash" size={18} color={COLORS.textDark} title="Delete" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.tileAmount}>₹{formatIndianCurrency(asset.amount)}</Text>
            {asset.targetAmount && (
              <Text style={[styles.tileAmount, { fontSize: 14, color: COLORS.textSecondary }]}>
                Target: ₹{formatIndianCurrency(asset.targetAmount)}
              </Text>
            )}
            <View style={styles.tileFooter}>
              <Text style={styles.tilePercentage}>{asset.percentage}%</Text>
              <View style={styles.tileBadges}>
                <View style={[styles.tileBadge, { backgroundColor: asset.investmentType === 'Invested' ? COLORS.invested : asset.investmentType === 'Liquid' ? COLORS.liquid : COLORS.lend }]}>
                  <Text style={styles.tileBadgeText}>{asset.investmentType}</Text>
                </View>
                <View style={[
                  styles.tileBadge,
                  {
                    backgroundColor:
                      asset.riskCategory === 'Low' ? COLORS.lowRisk :
                      asset.riskCategory === 'Moderate' ? COLORS.moderateRisk :
                      COLORS.highRisk
                  }
                ]}>
                  <Text style={styles.tileBadgeText}>{asset.riskCategory}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderAssetPanel = () => {
    if (!assets || assets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No assets yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first asset</Text>
        </View>
      );
    }

    const sortedAssets = [...assets].sort((a, b) => b.percentage - a.percentage);

    return (
      <View style={styles.panelContainer}>
        {sortedAssets.map((asset) => (
          <View key={asset.id} style={[
            styles.panelCard,
            { borderLeftColor: asset.investmentType === 'Invested' ? COLORS.invested : asset.investmentType === 'Liquid' ? COLORS.liquid : COLORS.lend }
          ]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelName}>{asset.name}</Text>
              <View style={styles.panelActions}>
                <TouchableOpacity onPress={() => openEditModal(asset)} style={styles.actionButtonEdit} accessibilityLabel="Edit" accessibilityHint="Edit this asset" title="Edit">
                  <Icon name="pencil" size={18} color={COLORS.textDark} title="Edit" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(asset)} style={styles.actionButtonDelete} accessibilityLabel="Delete" accessibilityHint="Delete this asset" title="Delete">
                  <Icon name="trash" size={18} color={COLORS.textDark} title="Delete" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.panelAmount}>₹{formatIndianCurrency(asset.amount)}</Text>
            {asset.targetAmount && (
              <Text style={[styles.panelAmount, { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 }]}>
                Target: ₹{formatIndianCurrency(asset.targetAmount)}
              </Text>
            )}
            <Text style={styles.panelPercentage}>{asset.percentage}% of total</Text>
            <View style={styles.panelBadges}>
              <View style={[styles.panelBadge, { backgroundColor: asset.investmentType === 'Invested' ? COLORS.invested : asset.investmentType === 'Liquid' ? COLORS.liquid : COLORS.lend }]}>
                <Text style={styles.panelBadgeText}>{asset.investmentType}</Text>
              </View>
              <View style={[
                styles.panelBadge,
                {
                  backgroundColor:
                    asset.riskCategory === 'Low' ? COLORS.lowRisk :
                    asset.riskCategory === 'Moderate' ? COLORS.moderateRisk :
                    COLORS.highRisk
                }
              ]}>
                <Text style={styles.panelBadgeText}>{asset.riskCategory} Risk</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderAsset = ({ item }) => (
    <View style={styles.assetCard}>
      <View style={styles.assetContent}>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetAmount}>₹{formatIndianCurrency(item.amount)}</Text>
          <View style={styles.assetTags}>
            <View style={[styles.tag, { backgroundColor: item.investmentType === 'Invested' ? COLORS.invested : item.investmentType === 'Liquid' ? COLORS.liquid : COLORS.lend }]}>
              <Text style={styles.tagText}>{item.investmentType}</Text>
            </View>
            <View style={[
              styles.tag,
              {
                backgroundColor:
                  item.riskCategory === 'Low' ? COLORS.lowRisk :
                  item.riskCategory === 'Moderate' ? COLORS.moderateRisk :
                  COLORS.highRisk
              }
            ]}>
              <Text style={styles.tagText}>{item.riskCategory} Risk</Text>
            </View>
          </View>
          <Text style={styles.assetPercentage}>{item.percentage}% of total</Text>
        </View>
        <View style={styles.assetActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.info + '20' }]}
            onPress={() => openEditModal(item)}>
            <Icon name="pencil" size={20} color={COLORS.info} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.error + '20' }]}
            onPress={() => handleDelete(item)}>
            <Icon name="trash" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isDesktop && <Sidebar navigation={navigation} currentRoute="Assets" />}
      
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Assets</Text>
          <TouchableOpacity style={styles.addButton} 
            onPress={openAddModal}
              accessibilityLabel="Add" accessibilityHint="Add new asset" title="Add">
            <Icon name="add" size={18} color="#FFFFFF" title="Add" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.section}>
            {(!settings?.dashboardViewType || settings?.dashboardViewType.toLowerCase() === 'grid' || settings?.dashboardViewType.toLowerCase() === 'table') && renderAssetGrid()}
            {settings?.dashboardViewType?.toLowerCase() === 'tiles' && renderAssetTiles()}
            {settings?.dashboardViewType?.toLowerCase() === 'panel' && renderAssetPanel()}
          </View>
        </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit' : 'Add'} Asset</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput style={styles.input}
                placeholder="Asset Name"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <TextInput style={styles.input}
                placeholder="Amount (₹)"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
              />

              <TextInput style={styles.input}
                placeholder="Target Amount (₹) - Optional"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={formData.targetAmount}
                onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
              />

              <Text style={styles.label}>Asset Type</Text>
              <View style={styles.optionsContainer}>
                {['Invested', 'Liquid', 'Lend'].map((type) => (
                  <TouchableOpacity
                    key={type} style={[
                      styles.optionButton,
                      formData.investmentType === type && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, investmentType: type })}>
                    <Text style={[
                        styles.optionText,
                        formData.investmentType === type && styles.optionTextSelected,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Risk Category</Text>
              <View style={styles.optionsContainer}>
                {['Low', 'Moderate', 'High'].map((risk) => (
                  <TouchableOpacity
                    key={risk} style={[
                      styles.optionButton,
                      formData.riskCategory === risk && styles.optionButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, riskCategory: risk })}>
                    <Text style={[
                        styles.optionText,
                        formData.riskCategory === risk && styles.optionTextSelected,
                      ]}>
                      {risk}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                  {editMode ? 'Update' : 'Add'} Asset
                </Text>
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
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Asset</Text>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Icon name="close" size={28} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              <Text style={[styles.label, { marginBottom: 20, fontSize: FONTS.medium }]}>
                Are you sure you want to delete {assetToDelete?.name}?
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: COLORS.textSecondary, flex: 1 }]}
                  onPress={() => setDeleteModalVisible(false)}>
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#dc3545', flex: 1 }]}
                  onPress={confirmDelete}>
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
    paddingTop: 17,
    paddingBottom: 32,
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
  },
  section: {
    padding: SIZES.padding,
  },
  gridContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius * 1.5,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    margin: SIZES.margin,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  gridHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 15,
    alignItems: 'center',
  },
  gridHeaderText: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'left',
  },
  gridRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    minHeight: 60,
  },
  gridCell: {
    fontSize: FONTS.regular,
    color: COLORS.text,
    textAlign: 'left',
    justifyContent: 'center',
    textTransform: 'none',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  riskBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  iconButton: {
    padding: 4,
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
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  tileCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.borderRadius * 1.5,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: isDesktop ? (windowWidth - 240 - 60) / 3 : windowWidth - 40,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tileName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textTransform: 'none',
  },
  tileActions: {
    flexDirection: 'row',
    gap: 10,
  },
  tileAction: {
    padding: 5,
  },
  tileAmount: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  tileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tilePercentage: {
    fontSize: FONTS.medium,
    color: COLORS.success,
    fontWeight: '600',
  },
  tileBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  tileBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tileBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  panelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  panelCard: {
    flex: 1,
    maxWidth: '23%',
    minWidth: 280,
    backgroundColor: COLORS.surface,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.borderRadius * 1.5,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelName: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textTransform: 'none',
  },
  panelActions: {
    flexDirection: 'row',
    gap: 10,
  },
  panelAmount: {
    fontSize: FONTS.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  panelPercentage: {
    fontSize: FONTS.regular,
    color: COLORS.success,
    fontWeight: '600',
    marginBottom: 12,
  },
  panelBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  panelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  panelBadgeText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  listContainer: {
    padding: SIZES.padding,
  },
  assetCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assetContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  assetAmount: {
    fontSize: FONTS.xlarge,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  assetTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tagText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  assetPercentage: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
  },
  assetActions: {
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 10,
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
    maxHeight: 'calc(90% + 40px)',
    height: isDesktop ? 'auto' : 'calc(90% + 40px)',
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
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    fontSize: FONTS.medium,
    color: COLORS.text,
    marginBottom: 15,
  },
  label: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.textDark,
    fontWeight: '600',
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






