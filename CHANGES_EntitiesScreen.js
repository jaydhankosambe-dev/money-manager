// ============================================
// CHANGES FOR EntitiesScreen.js (will become AssetsScreen.js)
// ============================================

// 1. ADD IMPORT at the top
import { formatIndianCurrency } from '../utils/formatCurrency';

// 2. REMOVE the local formatIndianCurrency function (it's now imported)

// 3. STANDARDIZE ADD BUTTON ICON SIZE
// Find the add button in the header (search for "add-circle")
// Change from size={28} or size={24} to size={20}

// Example:
<TouchableOpacity 
  onPress={openAddModal}
  accessibilityLabel="Add Asset"
  accessibilityHint="Add a new asset"
>
  <Ionicons name="add-circle" size={20} color={COLORS.primary} />
</TouchableOpacity>

// 4. ADD ACCESSIBILITY LABELS FOR ACTION ICONS

// For Edit icon (in action column):
<TouchableOpacity 
  onPress={() => openEditModal(asset)}
  accessibilityLabel="Edit"
  accessibilityHint="Edit this asset"
  style={styles.actionButton}
>
  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
</TouchableOpacity>

// For Delete icon (in action column):
<TouchableOpacity 
  onPress={() => handleDelete(asset.id)}
  accessibilityLabel="Delete"
  accessibilityHint="Delete this asset"
  style={styles.actionButton}
>
  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
</TouchableOpacity>

// 5. FUTURE: RENAME Entity to Asset
// This will be done in a separate step as it requires:
// - File rename: EntitiesScreen.js → AssetsScreen.js
// - Update all variable names: entity → asset, entities → assets
// - Update style names: entityCard → assetCard, etc.
// - Update navigation references
// - Update API endpoints

// Add optional style for action buttons to improve hover feedback:
actionButton: {
  padding: 4,
  marginHorizontal: 4,
},
