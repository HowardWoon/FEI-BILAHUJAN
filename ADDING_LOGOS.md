# Adding Official Resource Logos

## Folder Structure
```
src/
  assets/
    logos/
      jps.svg (or .png)
      nadma.svg (or .png)
      apm.svg (or .png)
```

## ✅ Folder Created
The logos folder is ready at:
```
c:\Users\USER\Downloads\BILAHUJAN\src\assets\logos\
```

## Step-by-Step Instructions

### Option 1: Download Official Logos (Recommended)

**1. Download the logos:**

You can download them from the current URLs or use your own:

- **JPS Logo**: https://upload.wikimedia.org/wikipedia/commons/1/1a/Department_of_Irrigation_and_Drainage_%28Malaysia%29_logo.svg
- **NADMA Logo**: https://upload.wikimedia.org/wikipedia/commons/5/52/National_Disaster_Management_Agency_%28Malaysia%29_logo.svg
- **APM Logo**: https://upload.wikimedia.org/wikipedia/commons/7/7b/Malaysia_Civil_Defence_Force_logo.svg

**2. Save them to the logos folder:**

Save the downloaded files as:
- `jps.svg` (or `jps.png`)
- `nadma.svg` (or `nadma.png`)
- `apm.svg` (or `apm.png`)

**3. Update ReportScreen.tsx:**

Open `src/screens/ReportScreen.tsx` and:

**Uncomment the import statements** (around line 7-10):
```typescript
// Change from:
// import jpsLogo from '../assets/logos/jps.svg';
// import nadmaLogo from '../assets/logos/nadma.svg';
// import apmLogo from '../assets/logos/apm.svg';

// To:
import jpsLogo from '../assets/logos/jps.svg';
import nadmaLogo from '../assets/logos/nadma.svg';
import apmLogo from '../assets/logos/apm.svg';
```

**Update the logo references** (around line 605-635):
```typescript
// Change from:
logo: 'https://upload.wikimedia.org/wikipedia/...'

// To:
logo: jpsLogo    // for JPS
logo: nadmaLogo  // for NADMA
logo: apmLogo    // for APM
```

### Option 2: Use npm Script to Auto-Download (Alternative)

If you prefer automated download, run:
```bash
node src/download_logos.cjs
```

This will download and convert logos to base64, but you'll need to update the output path in the script.

## File Format Support

The app supports:
- **SVG** (Recommended) - Scalable, small file size
- **PNG** - Good quality, transparent background
- **JPG** - Larger file size, no transparency

## Example Files Location

After adding your images:
```
✅ c:\Users\USER\Downloads\BILAHUJAN\src\assets\logos\jps.svg
✅ c:\Users\USER\Downloads\BILAHUJAN\src\assets\logos\nadma.svg
✅ c:\Users\USER\Downloads\BILAHUJAN\src\assets\logos\apm.svg
```

## Quick Test

After adding images:
1. Save the files in the logos folder
2. Uncomment the imports in ReportScreen.tsx
3. Update the logo properties to use imported variables
4. Run: `npm run dev`
5. Navigate to the Report screen
6. You should see the logos displayed!

## Troubleshooting

**Import errors?**
- Make sure file extensions match (.svg, .png, etc.)
- Check file names are lowercase
- Verify files are in the correct folder

**Images not showing?**
- Check browser console for errors
- Verify import paths are correct
- Make sure Vite can handle the image format

**Want to use PNG instead of SVG?**
Just change the import extension:
```typescript
import jpsLogo from '../assets/logos/jps.png';
```

## Alternative: Public Folder Method

If you prefer to use the public folder:

1. Create `public/logos/` folder
2. Place images there
3. Use in code as:
```typescript
logo: '/logos/jps.svg'
```

This method doesn't require imports but images won't be optimized by Vite.

---

**Current Status**: ✅ Folder created, code updated with comments
**Next Step**: Add your logo image files to `src/assets/logos/`
