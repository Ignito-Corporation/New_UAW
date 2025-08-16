# Unified PDF Integration Guide

This guide explains how to integrate the unified PDF service into your existing screens to replace multiple PDF generation with a single PDF containing all data.

## Overview

The unified PDF system consists of three main components:

1. **UnifiedPDFService** - Core service for generating single PDFs with all data
2. **UnifiedPDFButton** - Reusable button component for PDF generation
3. **UnifiedPDFGenerator** - Full-featured component (optional)

## Quick Integration

### Step 1: Import the required components

```javascript
import UnifiedPDFService from '../../component/UnifiedPDFService';
import UnifiedPDFButton from '../../component/UnifiedPDFButton';
```

### Step 2: Add state for PDF generation

```javascript
constructor(props) {
  super(props);
  this.state = {
    // ... existing state
    generatingPDF: false,
    pdfProgress: 0,
  };
}
```

### Step 3: Create the PDF generation method

```javascript
createUnifiedPDF = async () => {
  const { data, searchQuery } = this.state;
  
  if (!data || data.length === 0) {
    showMessage({
      message: 'No Data',
      description: 'No data available to generate PDF.',
      type: 'warning',
      duration: 3000,
    });
    return;
  }

  this.setState({ generatingPDF: true, pdfProgress: 0 });

  try {
    const result = await UnifiedPDFService.createUnifiedPDF(
      data,
      'Your Report Title',
      searchQuery,
      (progress) => this.setState({ pdfProgress: progress })
    );

    if (result) {
      console.log('PDF created successfully:', result);
    }
  } catch (error) {
    console.error('PDF creation error:', error);
  } finally {
    this.setState({ generatingPDF: false, pdfProgress: 0 });
  }
};
```

### Step 4: Add the PDF button to your render method

```javascript
{data.length > 0 && (
  <View style={styles.resultsContainer}>
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsTitle}>
        Found {data.length} products
      </Text>
    </View>

    {/* Unified PDF Button */}
    <UnifiedPDFButton
      data={data}
      title="Generate Unified PDF"
      searchQuery={searchQuery}
      onPress={this.createUnifiedPDF}
      generatingPDF={generatingPDF}
      pdfProgress={pdfProgress}
      disabled={data.length === 0}
    />

    {/* Your existing list/table */}
    <FlatList
      data={data}
      renderItem={this.renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
)}
```

## Features

### ✅ Single PDF with All Data
- All data is consolidated into one PDF file
- No more multiple PDF files for large datasets
- Maintains the same UI theme and colors

### ✅ App Theme Integration
- Uses your app's color scheme from `appColors`
- Consistent styling across all PDFs
- Professional card-based layout

### ✅ Progress Tracking
- Real-time progress updates during PDF generation
- Visual feedback with progress percentage
- Loading states and error handling

### ✅ Cross-Platform Support
- Works on both iOS and Android
- Automatic storage permission handling
- Multiple fallback options for file storage

### ✅ Error Handling
- Comprehensive error handling and user feedback
- Graceful fallbacks for different scenarios
- Clear error messages and retry options

## Customization

### Custom PDF Title
```javascript
const result = await UnifiedPDFService.createUnifiedPDF(
  data,
  'Custom Report Title', // Your custom title
  searchQuery,
  onProgress
);
```

### Custom Search Query
```javascript
const result = await UnifiedPDFService.createUnifiedPDF(
  data,
  'Report Title',
  'Your search query or filter criteria', // Custom search info
  onProgress
);
```

### Custom Progress Callback
```javascript
const result = await UnifiedPDFService.createUnifiedPDF(
  data,
  'Report Title',
  searchQuery,
  (progress) => {
    // Custom progress handling
    this.setState({ pdfProgress: progress });
    console.log(`PDF Progress: ${progress}%`);
  }
);
```

## Migration from Multiple PDFs

### Before (Multiple PDFs)
```javascript
// Old approach - creates multiple PDFs
createPDF = async () => {
  const chunks = this.chunkArray(data, 25);
  for (let i = 0; i < chunks.length; i++) {
    const htmlContent = this.generateChunkPDFContent(chunk, i, totalChunks, data);
    const result = await RNHTMLtoPDF.convert(pdfOptions);
    // Creates multiple files
  }
};
```

### After (Single Unified PDF)
```javascript
// New approach - creates single PDF with all data
createUnifiedPDF = async () => {
  const result = await UnifiedPDFService.createUnifiedPDF(
    data, // All data in one call
    'Report Title',
    searchQuery,
    onProgress
  );
};
```

## Benefits

1. **Simplified Code**: No need to manage multiple PDF files
2. **Better UX**: Single file instead of multiple files
3. **Consistent Styling**: Uses your app's theme colors
4. **Better Performance**: More efficient than multiple PDF generation
5. **Easier Management**: One file to share, store, or email

## Troubleshooting

### Common Issues

1. **Permission Denied**: The service handles permissions automatically
2. **Storage Issues**: Multiple fallback storage locations
3. **Large Data**: Optimized for handling large datasets
4. **Memory Issues**: Efficient HTML generation and processing

### Debug Information
```javascript
// Add this to see detailed logs
const result = await UnifiedPDFService.createUnifiedPDF(
  data,
  'Report Title',
  searchQuery,
  (progress) => {
    console.log(`PDF Progress: ${progress}%`);
    this.setState({ pdfProgress: progress });
  }
);

console.log('PDF Result:', result);
```

## Example Integration

See `src/screen/SearchByVehicle/SearchByVehicleScreenUpdated.js` for a complete example of how to integrate the unified PDF service into an existing screen. 