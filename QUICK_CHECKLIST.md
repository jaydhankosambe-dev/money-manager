# MoneyManager - Quick Implementation Checklist

## ✅ COMPLETED
- [x] Created `src/utils/formatCurrency.js` with Indian currency formatting functions
- [x] Created `IMPLEMENTATION_GUIDE.md` with detailed instructions
- [x] Created change instruction files for each screen
- [x] Created PowerShell script for Entity→Asset renaming

## 🔄 TO BE IMPLEMENTED

### Priority 1: Quick Fixes (Can be done immediately)

#### 1. Fix Tracker Amount Formatting
**File:** `Frontend/src/screens/TrackerScreen.js`

```javascript
// At top, add import:
import { formatIndianCurrency } from '../utils/formatCurrency';

// Replace the formatAmount function (around line 240):
const formatAmount = (amount) => {
  return formatIndianCurrency(amount);
};

// Update chart formatYLabel (around line 315):
formatYLabel={(value) => `₹${formatIndianCurrency(parseFloat(value))}`}
```

#### 2. Increase Font Size in Charts
**File:** `Frontend/src/screens/ChartsScreen.js`

Search for all `fontSize:` properties and increase each value by 2
- `fontSize: 12` → `fontSize: 14`
- `fontSize: 14` → `fontSize: 16`
- `fontSize: 16` → `fontSize: 18`
- etc.

#### 3. Standardize Add Button Icon Size
**Files:** 
- `Frontend/src/screens/EntitiesScreen.js`
- `Frontend/src/screens/TrackerScreen.js`

Find add button icons and change to `size={20}`:
```javascript
<Ionicons name="add-circle" size={20} color={COLORS.primary} />
```

#### 4. Add Accessibility Labels for Tooltips
**Files:** 
- `Frontend/src/screens/EntitiesScreen.js`
- `Frontend/src/screens/TrackerScreen.js`

Add to Edit icon:
```javascript
<TouchableOpacity 
  onPress={() => handleEdit(item)}
  accessibilityLabel="Edit"
  accessibilityHint="Edit this entry"
>
  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
</TouchableOpacity>
```

Add to Delete icon:
```javascript
<TouchableOpacity 
  onPress={() => handleDelete(item.id)}
  accessibilityLabel="Delete"
  accessibilityHint="Delete this entry"
>
  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
</TouchableOpacity>
```

### Priority 2: Entity → Asset Renaming (Complex - requires server restart)

**Prerequisites:**
1. Stop backend server (port 5000)
2. Stop frontend server (port 8081)
3. Commit current changes to git (if using version control)

**Steps:**

1. **Run PowerShell Script** (Optional - for file renaming only)
   ```powershell
   cd C:\MoneyManager
   .\Rename-EntityToAsset.ps1
   ```

2. **Backend Changes**

   **File: `Models/Entity.cs` → `Models/Asset.cs`**
   - Rename class: `public class Entity` → `public class Asset`
   - Keep all properties the same

   **File: `DTOs/EntityDtos.cs` → `DTOs/AssetDtos.cs`**
   - `EntityDto` → `AssetDto`
   - `CreateEntityRequest` → `CreateAssetRequest`
   - `UpdateEntityRequest` → `UpdateAssetRequest`

   **File: `Services/IEntityService.cs` → `Services/IAssetService.cs`**
   - `interface IEntityService` → `interface IAssetService`
   - Update method return types

   **File: `Services/EntityService.cs` → `Services/AssetService.cs`**
   - `public class EntityService : IEntityService` → `public class AssetService : IAssetService`
   - Update all Entity references to Asset

   **File: `Data/ApplicationDbContext.cs`**
   - `public DbSet<Entity> Entities` → `public DbSet<Asset> Assets`

   **File: `Controllers/EntitiesController.cs` → `Controllers/AssetsController.cs`**
   - `[Route("api/[controller]")]` → `[Route("api/assets")]`
   - `public class EntitiesController` → `public class AssetsController`
   - `private readonly IEntityService _entityService` → `private readonly IAssetService _assetService`

   **File: `Program.cs`**
   - `builder.Services.AddScoped<IEntityService, EntityService>();` 
     → `builder.Services.AddScoped<IAssetService, AssetService>();`

3. **Database Migration**
   ```sql
   -- Connect to SQL Server
   USE MoneyManagerDb;
   
   -- Rename table
   EXEC sp_rename 'Entities', 'Assets';
   
   -- Verify
   SELECT * FROM Assets;
   ```

4. **Frontend Changes**

   **File: `services/api.js`**
   - `const entitiesAPI = {` → `const assetsAPI = {`
   - All `/api/entities` → `/api/assets`
   - Export: `entitiesAPI` → `assetsAPI`

   **File: `screens/EntitiesScreen.js` → `screens/AssetsScreen.js`**
   - Import: `import { formatIndianCurrency } from '../utils/formatCurrency';`
   - Remove local `formatIndianCurrency` function
   - Variable names: `entity` → `asset`, `entities` → `assets`
   - API calls: `entitiesAPI` → `assetsAPI`
   - Style names: `entityCard` → `assetCard`, `entityContent` → `assetContent`, etc.
   - Function names: `openEntityModal` → `openAssetModal`, etc.

   **File: `navigation/MainTabNavigator.js`**
   - Import: `import AssetsScreen from '../screens/AssetsScreen';`
   - Screen name: `<Tab.Screen name="Assets" component={AssetsScreen} />`
   - Icon and label updates if needed

5. **Build and Test**
   ```powershell
   # Backend
   cd C:\MoneyManager\Backend
   dotnet build
   dotnet run
   
   # Frontend (new terminal)
   cd C:\MoneyManager\Frontend
   npm start
   ```

6. **Test Checklist**
   - [ ] Backend builds without errors
   - [ ] Frontend builds without errors
   - [ ] Can view assets list
   - [ ] Can add new asset
   - [ ] Can edit existing asset
   - [ ] Can delete asset
   - [ ] Dashboard shows correct data
   - [ ] All amounts display in Indian format
   - [ ] Icon sizes are consistent
   - [ ] Charts font sizes are larger
   - [ ] No "Entity" text visible in UI

## 📋 Files Summary

### Created Files:
- ✅ `Frontend/src/utils/formatCurrency.js` - Currency formatting utilities
- ✅ `IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
- ✅ `CHANGES_TrackerScreen.js` - TrackerScreen change instructions
- ✅ `CHANGES_ChartsScreen.js` - ChartsScreen change instructions
- ✅ `CHANGES_EntitiesScreen.js` - EntitiesScreen change instructions
- ✅ `Rename-EntityToAsset.ps1` - PowerShell renaming script

### Files to Modify:
- `Frontend/src/screens/TrackerScreen.js`
- `Frontend/src/screens/ChartsScreen.js`
- `Frontend/src/screens/EntitiesScreen.js` → `AssetsScreen.js`
- `Frontend/src/services/api.js`
- `Frontend/src/navigation/MainTabNavigator.js`
- `Backend/Models/Entity.cs` → `Asset.cs`
- `Backend/DTOs/EntityDtos.cs` → `AssetDtos.cs`
- `Backend/Services/EntityService.cs` → `AssetService.cs`
- `Backend/Services/IEntityService.cs` → `IAssetService.cs`
- `Backend/Controllers/EntitiesController.cs` → `AssetsController.cs`
- `Backend/Data/ApplicationDbContext.cs`
- `Backend/Program.cs`

## ⚡ Quick Start

1. **Do Priority 1 fixes first** (tracker formatting, font sizes, icon sizes, accessibility labels)
2. **Test thoroughly**
3. **Then tackle Priority 2** (Entity → Asset renaming) when ready for larger refactor

## 🆘 Need Help?

Refer to:
- `IMPLEMENTATION_GUIDE.md` for detailed explanations
- `CHANGES_*.js` files for specific code snippets
- `Rename-EntityToAsset.ps1` for automated file renaming

