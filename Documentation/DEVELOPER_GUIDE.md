# Money Manager - Developer Guide

## Development Environment Setup

### Prerequisites
- Visual Studio 2022 or VS Code with C# extension
- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or Express)
- Git
- Expo CLI: `npm install -g expo-cli`

### Backend Development

#### Running in Development Mode
```bash
cd Backend
dotnet watch run
```
This will auto-reload on code changes.

#### Database Migrations
```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

#### Testing API with Swagger
Navigate to `https://localhost:5001/swagger` when the API is running.

### Frontend Development

#### Development Server
```bash
cd Frontend
npm start
```

#### Platform-Specific Development
```bash
# Web (opens in browser)
npm run web

# Android (requires Android Studio)
npm run android

# iOS (requires Xcode on Mac)
npm run ios
```

#### Clear Cache
```bash
expo start -c
```

## Code Style Guide

### Backend (C#)
- Use PascalCase for classes, methods, and properties
- Use camelCase for local variables and parameters
- Always use explicit types
- Add XML documentation comments for public APIs
- Use async/await for all I/O operations
- Follow SOLID principles

Example:
```csharp
/// <summary>
/// Creates a new entity for the specified user
/// </summary>
/// <param name="userId">The user ID</param>
/// <param name="request">The entity creation request</param>
/// <returns>The created entity</returns>
public async Task<EntityDto> CreateEntityAsync(int userId, CreateEntityRequest request)
{
    // Implementation
}
```

### Frontend (JavaScript/React Native)
- Use camelCase for variables and functions
- Use PascalCase for components
- Use arrow functions for components
- Destructure props and state
- Use hooks for state management
- Add PropTypes or TypeScript for type checking

Example:
```javascript
const EntityCard = ({ entity, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <View style={styles.card}>
      {/* Component content */}
    </View>
  );
};
```

## Project Architecture

### Backend Architecture

#### Layered Architecture
1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Business logic layer
3. **Data**: Database context and migrations
4. **Models**: Entity models
5. **DTOs**: Data transfer objects

#### Dependency Injection
Services are registered in `Program.cs`:
```csharp
builder.Services.AddScoped<IEntityService, EntityService>();
```

#### Error Handling
- Use try-catch blocks in controllers
- Return appropriate HTTP status codes
- Provide meaningful error messages

### Frontend Architecture

#### Component Structure
```
Screen Component
├── Header
├── Content
│   ├── List/Grid Items
│   └── Action Buttons
└── Modals/Dialogs
```

#### State Management
- Local state with `useState` for component-specific data
- Navigation params for data passing
- AsyncStorage for persistent data
- API calls on component mount and focus

#### Navigation Flow
```
App
├── LoginScreen
└── MainTabNavigator
    ├── DashboardScreen
    ├── EntitiesScreen
    ├── ChartsScreen
    └── SettingsScreen
```

## API Integration

### Making API Calls

#### In Services (api.js)
```javascript
export const entityAPI = {
  getAll: async () => {
    const response = await api.get('/entities');
    return response.data;
  },
};
```

#### In Components
```javascript
const loadData = async () => {
  try {
    setLoading(true);
    const data = await entityAPI.getAll();
    setEntities(data);
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

## Database Management

### Entity Relationships
- Users have many Entities (one-to-many)
- Users have many MonthlyEntries (one-to-many)
- Users have one UserSettings (one-to-one)

### Cascading Deletes
When a user is deleted, all related entities, monthly entries, and settings are automatically deleted.

### Indexing
- Unique indexes on User.Email and User.GoogleId
- Foreign key indexes for relationships

## Security Best Practices

### Backend
- Always validate user input
- Use parameterized queries (EF Core handles this)
- Implement proper authentication on all protected endpoints
- Use HTTPS in production
- Keep JWT secret key secure
- Implement rate limiting in production

### Frontend
- Store tokens securely (AsyncStorage)
- Never commit sensitive data
- Validate all user input before API calls
- Use secure HTTP requests
- Clear sensitive data on logout

## Testing

### Backend Testing
Create a `Tests` project:
```bash
dotnet new xunit -n MoneyManager.Tests
```

Example test:
```csharp
[Fact]
public async Task CreateEntity_ValidData_ReturnsEntity()
{
    // Arrange
    var service = new EntityService(context);
    var request = new CreateEntityRequest { Name = "Test", Amount = 1000 };
    
    // Act
    var result = await service.CreateEntityAsync(1, request);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("Test", result.Name);
}
```

### Frontend Testing
Use Jest and React Native Testing Library:
```bash
npm install --save-dev @testing-library/react-native
```

## Performance Optimization

### Backend
- Use `AsNoTracking()` for read-only queries
- Implement pagination for large datasets
- Use projection to select only needed fields
- Cache frequently accessed data
- Use indexes on filtered columns

### Frontend
- Implement FlatList for large lists
- Use memo for expensive computations
- Optimize images (compress and resize)
- Lazy load components
- Debounce search inputs

## Deployment

### Backend Deployment

#### Prepare for Production
1. Update `appsettings.Production.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_PRODUCTION_CONNECTION_STRING"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECURE_SECRET_KEY"
  }
}
```

2. Publish:
```bash
dotnet publish -c Release -o ./publish
```

#### Deploy to Azure App Service
```bash
az webapp deployment source config-zip --resource-group MyResourceGroup --name MyAppName --src publish.zip
```

### Frontend Deployment

#### Web Deployment
```bash
expo build:web
```
Deploy the `web-build` folder to hosting service (Netlify, Vercel, etc.)

#### Android Deployment
```bash
expo build:android -t app-bundle
```
Upload to Google Play Console

#### iOS Deployment
```bash
expo build:ios
```
Upload to App Store Connect

## Monitoring and Logging

### Backend Logging
Use built-in logging:
```csharp
private readonly ILogger<EntityService> _logger;

_logger.LogInformation("Entity created: {EntityId}", entity.Id);
_logger.LogError(ex, "Error creating entity");
```

### Frontend Logging
Use console for development:
```javascript
console.log('Data loaded:', data);
console.error('Error:', error);
```

For production, integrate services like Sentry or LogRocket.

## Version Control

### Git Workflow
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to remote: `git push origin feature/new-feature`
4. Create pull request
5. Merge after review

### Commit Message Convention
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(entities): add delete confirmation dialog

Added a confirmation dialog when deleting entities to prevent
accidental deletions.

Closes #123
```

## Useful Commands

### Backend
```bash
# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Clean
dotnet clean

# Format code
dotnet format
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm start

# Clear cache and start
expo start -c

# Check for updates
expo upgrade

# Install new package
npm install package-name
```

## Debugging

### Backend Debugging
- Use Visual Studio debugger
- Set breakpoints in code
- Inspect variables and call stack
- Use immediate window for testing

### Frontend Debugging
- Use Chrome DevTools for web
- Use React Native Debugger for mobile
- Console.log for quick debugging
- React DevTools for component inspection

## Common Development Tasks

### Adding a New Entity
1. Create model in `Models/`
2. Add DbSet to `ApplicationDbContext`
3. Create migration and update database
4. Create DTOs
5. Create service interface and implementation
6. Create controller
7. Test with Swagger

### Adding a New Screen
1. Create screen component in `src/screens/`
2. Add route to navigator
3. Create API service methods
4. Implement UI with proper styling
5. Add error handling and loading states
6. Test on multiple platforms

## Resources
- [.NET Documentation](https://docs.microsoft.com/dotnet/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
- [React Navigation](https://reactnavigation.org/)

## Getting Help
- Check documentation first
- Search existing issues on GitHub
- Ask in team chat
- Create detailed bug reports with reproduction steps
