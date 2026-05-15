# Enhanced CSV Parser for Kaggle Telemetry Datasets

## Overview
The CSV parser in the upload page has been enhanced to robustly support real-world Kaggle telemetry datasets with various formats and edge cases.

## Features

### 1. Automatic Delimiter Detection
The parser automatically detects the delimiter used in your CSV file:
- **Comma (`,`)** - Standard CSV format
- **Semicolon (`;`)** - Common in European datasets
- **Tab (`\t`)** - TSV files
- **Pipe (`|`)** - Alternative delimiter

**Example:** Upload `test-semicolon.csv` to see semicolon delimiter detection in action.

### 2. UTF-8 Encoding Support
Full support for UTF-8 encoded files, allowing:
- International characters
- Special symbols
- Emoji and unicode characters

### 3. Empty Line Handling
The parser intelligently skips:
- Completely empty lines
- Lines with only whitespace
- Lines with only delimiters

This ensures clean data parsing even with inconsistent file formatting.

### 4. Fallback Header Generation
If your CSV file doesn't have headers, the parser will automatically generate them:
- `Column_1`, `Column_2`, `Column_3`, etc.
- Allows you to work with headerless datasets
- Console warning is logged when fallback headers are used

**Example:** Upload `test-no-headers.csv` to see automatic header generation.

### 5. Dynamic Typing
Numeric values are automatically converted from strings to numbers:
- `"123"` → `123`
- `"45.67"` → `45.67`
- Preserves string values when appropriate

### 6. Robust Error Handling
- Filters out minor parsing warnings
- Reports only critical errors (delimiter issues, field mismatches)
- Validates data before displaying
- Clear error messages for troubleshooting

### 7. Progress Tracking
Real-time progress updates for large file uploads:
- Visual progress bar
- Percentage completion
- Smooth user experience

## Test Files

### Standard CSV (Comma-delimited)
```csv
player_id,session_id,event_type,timestamp,level,score,duration_seconds
player_001,session_123,level_start,2024-01-15T10:00:00Z,1,0,0
```
Use: `sample-telemetry.csv`

### Semicolon-delimited CSV
```csv
player_id;session_id;event_type;timestamp;level;score;duration_seconds
player_001;session_123;level_start;2024-01-15T10:00:00Z;1;0;0
```
Use: `test-semicolon.csv`

### CSV without Headers
```csv
player_001,session_123,level_start,2024-01-15T10:00:00Z,1,0,0
player_001,session_123,enemy_defeated,2024-01-15T10:02:30Z,1,100,150
```
Use: `test-no-headers.csv`

## PapaParse Configuration

The parser uses the following PapaParse best practices:

```javascript
{
  delimiter: "",              // Auto-detect delimiter
  header: true,               // Parse first row as headers
  skipEmptyLines: "greedy",   // Skip empty and whitespace-only lines
  encoding: "UTF-8",          // UTF-8 encoding support
  dynamicTyping: true,        // Convert numbers automatically
  quoteChar: '"',             // Handle quoted fields
  escapeChar: '"',            // Handle escaped quotes
  comments: false,            // Don't treat # as comments
  delimitersToGuess: [',', '\t', '|', ';']  // Delimiters to try
}
```

## Usage

1. Navigate to the Upload page
2. Drag and drop your CSV file or click to browse
3. The parser will automatically:
   - Detect the delimiter
   - Parse headers or generate them
   - Skip empty lines
   - Convert numeric values
   - Display a preview of your data

## Supported File Formats

- `.csv` files (any delimiter)
- Maximum file size: 10MB
- UTF-8 encoding recommended
- Headers optional (will be auto-generated)

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Invalid file type" | File is not a CSV | Upload a `.csv` file |
| "File size exceeds 10MB limit" | File too large | Split file or compress |
| "Parse errors: Delimiter" | Can't detect delimiter | Check file format |
| "No valid data found" | File is empty or corrupted | Verify file contents |

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Performance

- Handles files up to 10MB efficiently
- Progress tracking for large files
- Streaming parse for memory efficiency
- Non-blocking UI during parsing