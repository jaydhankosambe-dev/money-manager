// ============================================
// CHANGES FOR TrackerScreen.js
// ============================================

// 1. ADD IMPORT at the top (after other imports)
import { formatIndianCurrency } from '../utils/formatCurrency';

// 2. REPLACE the formatAmount function (around line 240)
// OLD:
const formatAmount = (amount) => {
  if (amount >= 10000000) { // 1 crore and above
    return (amount / 10000000).toFixed(1) + 'Cr';
  } else if (amount >= 100000) { // 1 lakh and above
    return (amount / 100000).toFixed(1) + 'L';
  } else if (amount >= 1000) { // 1 thousand and above
    return (amount / 1000).toFixed(1) + 'T';
  } else {
    return amount.toString();
  }
};

// NEW:
const formatAmount = (amount) => {
  return formatIndianCurrency(amount);
};

// 3. UPDATE chart formatYLabel to use full format (around line 315)
// Find the LineChart component and update formatYLabel:
formatYLabel={(value) => `₹${formatIndianCurrency(parseFloat(value))}`}

// 4. ADD ICON SIZE STANDARDIZATION
// Find the add button icon (usually in header) and ensure it's size={20}
// Search for: <Ionicons name="add-circle"
// Make sure it has: size={20}

// 5. ADD TOOLTIP/TITLE FOR ICONS (if on web)
// For Edit icon:
<TouchableOpacity 
  onPress={() => handleEdit(item)}
  accessibilityLabel="Edit"
  accessibilityHint="Edit this entry"
>
  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
</TouchableOpacity>

// For Delete icon:
<TouchableOpacity 
  onPress={() => handleDelete(item.id)}
  accessibilityLabel="Delete"
  accessibilityHint="Delete this entry"
>
  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
</TouchableOpacity>

// For Add icon (in header):
<TouchableOpacity 
  onPress={handleAdd}
  accessibilityLabel="Add"
  accessibilityHint="Add new entry"
>
  <Ionicons name="add-circle" size={20} color={COLORS.primary} />
</TouchableOpacity>
