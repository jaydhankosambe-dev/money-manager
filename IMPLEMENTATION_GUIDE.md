# MoneyManager Application Updates - Implementation Guide

## Overview
This document outlines the changes needed to:
1. Fix tracker amount formatting to Indian format
2. Add tooltips/hover names for action icons
3. Rename Entity/Entities to Asset/Assets throughout the application
4. Standardize add button icon sizes
5. Increase font sizes in Charts screen

---

## 1. TRACKER AMOUNT FORMATTING (TrackerScreen.js)

### Current Issue
The `formatAmount` function uses abbreviated format (Cr, L, T) instead of Indian comma format

### Solution
Replace the formatAmount function with formatIndianCurrency

```javascript
// FIND:
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

// REPLACE WITH:
import { formatIndianCurrency } from '../utils/formatCurrency';

const formatAmount = (amount) => {
  return formatIndianCurrency(amount);
};
```

---

## 2. ADD ICON TOOLTIPS/HOVER NAMES

### Files to Update
- `EntitiesScreen.js` (Assets page)
- `TrackerScreen.js`

### Implementation
For React Native (mobile), we'll use `Tooltip` component or add text labels on long press.
For web, we can add title attributes.

```javascript
// Add import
import { Tooltip } from 'react-native-elements'; // or similar library

// Example for Edit icon:
<Tooltip popover={<Text>Edit</Text>}>
  <TouchableOpacity onPress={() => openEditModal(item)}>
    <Ionicons name="create-outline" size={20} color={COLORS.primary} />
  </TouchableOpacity>
</Tooltip>

// For Delete icon:
<Tooltip popover={<Text>Delete</Text>}>
  <TouchableOpacity onPress={() => handleDelete(item.id)}>
    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
  </TouchableOpacity>
</Tooltip>

// For Add icon:
<Tooltip popover={<Text>Add</Text>}>
  <TouchableOpacity onPress={openAddModal}>
    <Ionicons name="add-circle" size={20} color={COLORS.primary} />
  </TouchableOpacity>
</Tooltip>
```

---

## 3. RENAME ENTITY/ENTITIES TO ASSET/ASSETS

### Backend Files to Rename:
1. `Models/Entity.cs` → `Models/Asset.cs`
2. `DTOs/EntityDtos.cs` → `DTOs/AssetDtos.cs`
3. `Services/EntityService.cs` → `Services/AssetService.cs`
4. `Services/IEntityService.cs` → `Services/IAssetService.cs`
5. `Controllers/EntitiesController.cs` → `Controllers/AssetsController.cs` (if exists)

### Backend Content Changes:
- Class names: `Entity` → `Asset`
- DTO names: `EntityDto` → `AssetDto`, `CreateEntityRequest` → `CreateAssetRequest`, etc.
- Service names: `EntityService` → `AssetService`, `IEntityService` → `IAssetService`
- DbSet: `DbSet<Entity> Entities` → `DbSet<Asset> Assets`
- API routes: `/api/entities` → `/api/assets`
- Database table: `Entities` → `Assets`

### Frontend Files to Rename:
1. `screens/EntitiesScreen.js` → `screens/AssetsScreen.js`

### Frontend Content Changes:
- Import statements
- Navigation references
- API endpoints: `entitiesAPI` → `assetsAPI`
- Variable names: `entities` → `assets`, `entity` → `asset`
- Style class names: `entityCard` → `assetCard`, `entityContent` → `assetContent`, etc.
- Component names and props

### Database Migration:
```sql
-- Rename table
EXEC sp_rename 'Entities', 'Assets';

-- Update any foreign key references if they exist
```

---

## 4. STANDARDIZE ADD BUTTON ICON SIZE

### Current Issue
Add button icon size inconsistent with action column icons (Edit, Delete)

### Files to Update
- `EntitiesScreen.js` (Assets screen - when renamed)
- `TrackerScreen.js`

### Implementation
```javascript
// Action column icons use size={20}
// Update Add button to match:

// FIND (in header/toolbar):
<Ionicons name="add-circle" size={28} color={COLORS.primary} />

// REPLACE WITH:
<Ionicons name="add-circle" size={20} color={COLORS.primary} />
```

---

## 5. INCREASE FONT SIZE IN CHARTS SCREEN

### File to Update
- `ChartsScreen.js`

### Implementation
Find all `fontSize` properties and increase by 2:

```javascript
// Example changes:
fontSize: FONTS.small    → fontSize: FONTS.small + 2
fontSize: FONTS.medium   → fontSize: FONTS.medium + 2
fontSize: 12             → fontSize: 14
fontSize: 14             → fontSize: 16
fontSize: 16             → fontSize: 18

// Or add a constant multiplier at the top:
const FONT_SIZE_INCREASE = 2;
```

---

## Implementation Order (Recommended)

1. **Create utility file** (✓ Done)
   - `src/utils/formatCurrency.js`

2. **Update TrackerScreen formatting**
   - Import formatIndianCurrency
   - Update formatAmount function
   - Update chart labels

3. **Update ChartsScreen font sizes**
   - Increase all fontSize by 2

4. **Add icon tooltips**
   - EntitiesScreen (will become AssetsScreen)
   - TrackerScreen

5. **Standardize icon sizes**
   - Update add button icons to size 20

6. **Rename Entity to Asset** (Most complex - do last)
   - Backend model files
   - Backend service files
   - Backend DTOs
   - Backend controllers
   - Database table
   - Frontend screen file
   - Frontend API calls
   - Frontend navigation
   - All variable/style names

---

## Testing Checklist

- [ ] Tracker amounts display in Indian format (lakhs/crores with commas)
- [ ] Chart labels show proper Indian formatting
- [ ] Icon tooltips appear on hover/long-press
- [ ] All icons in action columns are same size (20)
- [ ] Add button icons match action column icon size
- [ ] Charts screen text is larger and more readable
- [ ] All "Entity" references changed to "Asset"
- [ ] Backend API endpoints work (`/api/assets`)
- [ ] Database queries work with Assets table
- [ ] Frontend navigation works with AssetsScreen
- [ ] No console errors
- [ ] Application builds successfully

