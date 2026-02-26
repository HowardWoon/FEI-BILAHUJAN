# Enable Local JPS Logo

## After you save jps.png to src/assets/logos/, make these changes:

### In src/screens/ReportScreen.tsx

**Line 7-10:** Uncomment the import:
```typescript
// Change FROM:
// import jpsLogo from '../assets/logos/jps.png';

// Change TO:
import jpsLogo from '../assets/logos/jps.png';
```

**Line 605:** Use the imported logo:
```typescript
// Change FROM:
logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Department_of_Irrigation_and_Drainage_%28Malaysia%29_logo.svg'

// Change TO:
logo: jpsLogo
```

### Verify File Location
Make sure the file exists at:
```
C:\Users\USER\Downloads\BILAHUJAN\src\assets\logos\jps.png
```

### Restart Dev Server
```bash
npm run dev
```

Your custom logo will now appear!
