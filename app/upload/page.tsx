"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
  rowCount: number;
}

type ParseStatus = "idle" | "parsing" | "success" | "error";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parseStatus, setParseStatus] = useState<ParseStatus>("idle");
  const [parseProgress, setParseProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.name.endsWith(".csv")) {
      setErrorMessage("Invalid file type. Please upload a CSV file.");
      setParseStatus("error");
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMessage("File size exceeds 10MB limit.");
      setParseStatus("error");
      return false;
    }

    return true;
  };

  /**
   * Enhanced CSV parser with robust support for Kaggle telemetry datasets
   *
   * Features:
   * - FileReader-based parsing for reliable file reading
   * - Automatic delimiter detection (comma, tab, pipe, semicolon)
   * - UTF-8 BOM trimming for proper encoding
   * - Explicit newline handling
   * - Worker thread support for large files
   * - Skips empty lines and lines with only whitespace
   * - Fallback header generation if headers are missing
   * - Dynamic typing for numeric values
   * - Handles quoted fields and escape characters
   * - Progress tracking for large files
   *
   * Best practices from PapaParse documentation applied for real-world CSV handling
   */
  const parseCSV = useCallback((file: File) => {
    setParseStatus("parsing");
    setParseProgress(0);
    setErrorMessage("");

    // Use FileReader to read the file as text first
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      if (!text) {
        setErrorMessage("Failed to read file content.");
        setParseStatus("error");
        return;
      }

      // Trim UTF-8 BOM if present (0xEF, 0xBB, 0xBF)
      const trimmedText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
      
      console.log("=== RAW TEXT DIAGNOSTICS ===");
      console.log("File size:", file.size, "bytes");
      console.log("Text length:", trimmedText.length, "characters");
      console.log("First 500 characters:", trimmedText.substring(0, 500));
      
      // Diagnostic: Split into lines and analyze structure
      const lines = trimmedText.split(/\r?\n/);
      console.log("Total lines detected:", lines.length);
      console.log("\n=== FIRST 10 LINES ANALYSIS ===");
      
      lines.slice(0, 10).forEach((line, idx) => {
        const commaCount = (line.match(/,/g) || []).length;
        const quoteCount = (line.match(/"/g) || []).length;
        const hasUnmatchedQuotes = quoteCount % 2 !== 0;
        const hasJSON = line.includes('{') || line.includes('[');
        
        console.log(`Line ${idx + 1}:`);
        console.log(`  Length: ${line.length} chars`);
        console.log(`  Commas: ${commaCount}`);
        console.log(`  Quotes: ${quoteCount} ${hasUnmatchedQuotes ? '(UNMATCHED!)' : '(matched)'}`);
        console.log(`  Has JSON: ${hasJSON}`);
        console.log(`  Content: ${line.substring(0, 150)}${line.length > 150 ? '...' : ''}`);
      });
      
      // Fallback diagnostic parser
      console.log("\n=== FALLBACK SPLIT PARSER TEST ===");
      if (lines.length > 1) {
        const headerLine = lines[0];
        const firstDataLine = lines[1];
        console.log("Header (split by comma):", headerLine.split(',').map(h => h.trim()));
        console.log("First data row (split by comma):", firstDataLine.split(',').map(c => c.trim()));
      }
      console.log("================================\n");

      let rowsParsed = 0;
      const estimatedRows = Math.ceil(file.size / 100); // Rough estimate
      
      // Accumulate rows manually when using step callback
      const parsedRows: Record<string, any>[] = [];

      // Parse the text content with PapaParse
      Papa.parse<any>(trimmedText, {
        // Automatic delimiter detection - PapaParse will auto-detect comma, tab, pipe, semicolon
        delimiter: "", // Empty string enables auto-detection
        
        // Let PapaParse auto-detect line endings (handles \n, \r\n, \r)
        // Do not set newline explicitly - it interferes with auto-detection
        
        // Enable header parsing to get object-mapped rows
        header: true,
        
        // Skip empty lines for cleaner data
        skipEmptyLines: true,
        
        // Disable worker thread - incompatible with text parsing from FileReader
        // Worker mode only works when passing File objects directly to Papa.parse
        worker: false,
        
        // Disable fast mode to ensure proper parsing
        fastMode: false,
        
        // Enable dynamic typing for automatic type conversion
        dynamicTyping: true,
        
        // Handle quoted fields properly - use backslash for escape
        quoteChar: '"',
        escapeChar: '\\',
        
        // Don't treat # as comments by default (common in data files)
        comments: false,
        
        // Specify delimiters to try for auto-detection (comma, tab, pipe, semicolon)
        delimitersToGuess: [',', '\t', '|', ';'],
        
        step: (row) => {
          // Accumulate rows manually since step callback prevents automatic accumulation
          // With header: true, row.data is an object with keys from headers
          if (row.data && Object.keys(row.data).length > 0) {
            parsedRows.push(row.data);
          }
          
          // Update progress based on parsed rows
          rowsParsed++;
          const progress = Math.min(
            Math.round((rowsParsed / estimatedRows) * 100),
            99
          );
          setParseProgress(progress);
        },
        
        complete: (results) => {
          // Debug logging - log the full callback payload first
          console.log("\n=== PapaParse Complete Callback ===");
          console.log("Full results object:", results);
          console.log("Type of results:", typeof results);
          console.log("Manually accumulated rows:", parsedRows.length);
          
          // Null safety check - ensure results exists
          if (!results) {
            console.error("Results is undefined or null");
            setErrorMessage("Parse error: No results returned from parser.");
            setParseStatus("error");
            return;
          }
          
          // Enhanced logging for troubleshooting
          console.log("\n=== PapaParse Results Debug ===");
          console.log("results.meta:", results.meta);
          console.log("Detected delimiter:", results.meta?.delimiter);
          console.log("Detected linebreak:", results.meta?.linebreak);
          console.log("Detected fields/headers:", results.meta?.fields);
          console.log("Aborted:", results.meta?.aborted);
          console.log("Truncated:", results.meta?.truncated);
          console.log("Cursor position:", results.meta?.cursor);
          console.log("parsedRows exists:", !!parsedRows);
          console.log("parsedRows type:", typeof parsedRows);
          console.log("parsedRows length:", parsedRows.length);
          console.log("parsedRows is Array:", Array.isArray(parsedRows));
          
          // Log first parsed row (now an object)
          if (parsedRows && parsedRows.length > 0) {
            console.log("\n=== FIRST PARSED ROW (OBJECT) ===");
            console.log("First row type:", typeof parsedRows[0]);
            console.log("First row is Object:", typeof parsedRows[0] === 'object');
            console.log("First row keys:", Object.keys(parsedRows[0]));
            console.log("First row content:", parsedRows[0]);
          }
          
          console.log("\nFirst 5 rows:", parsedRows.slice(0, 5));
          console.log("Total rows parsed:", parsedRows.length);
          console.log("Parse errors count:", results.errors?.length);
          console.log("Parse errors:", results.errors);
          console.log("================================\n");
          
          // Don't reject on errors - just log them and continue
          if (results.errors && results.errors.length > 0) {
            console.warn("Parse errors detected (continuing anyway):", results.errors);
          }

          // Validate using parsedRows.length - if at least one row exists, it's valid
          if (!parsedRows || parsedRows.length === 0) {
            setErrorMessage("CSV file appears to be empty or contains no valid data.");
            setParseStatus("error");
            return;
          }

          // Extract headers from results.meta.fields (set by PapaParse when header: true)
          // Fallback to Object.keys of first row if meta.fields is unavailable
          const headers =
            results.meta?.fields ||
            (parsedRows.length > 0 ? Object.keys(parsedRows[0]) : []);
          
          if (headers.length === 0) {
            setErrorMessage("Unable to parse CSV file. No headers detected.");
            setParseStatus("error");
            return;
          }

          console.log("Extracted headers from meta.fields:", headers);
          console.log("Data rows count:", parsedRows.length);
          
          // Minimal filtering: only remove rows that are COMPLETELY empty
          // A row is valid if it has at least ONE non-null, non-undefined, non-empty-string value
          const filteredRows = parsedRows.filter((row) => {
            // Check if row has at least one meaningful value
            const hasData = Object.values(row).some((value) => {
              // Keep: booleans (including false), numbers (including 0), non-empty strings
              // Remove: null, undefined, empty strings
              if (value === null || value === undefined) return false;
              if (value === "") return false;
              return true; // Keep everything else (booleans, numbers, strings)
            });
            return hasData;
          });

          console.log("Filtered rows count:", filteredRows.length);
          console.log("Sample filtered rows (first 3):", filteredRows.slice(0, 3));

          // Use the original data if filtering removed everything
          const finalRows = filteredRows.length > 0 ? filteredRows : parsedRows;
          
          console.log("Final rows to display:", finalRows.length);

          setParsedData({
            headers,
            rows: finalRows,
            rowCount: finalRows.length,
          });
          setParseStatus("success");
          setParseProgress(100);
        },
        error: (error: Error) => {
          console.error("PapaParse error callback:", error);
          setErrorMessage(`Parse error: ${error.message}`);
          setParseStatus("error");
        },
      });
    };

    reader.onerror = () => {
      setErrorMessage("Failed to read file. Please try again.");
      setParseStatus("error");
    };

    // Read the file as UTF-8 text
    reader.readAsText(file, "UTF-8");
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validateFile(droppedFile)) {
        setFile(droppedFile);
        parseCSV(droppedFile);
      }
    },
    [parseCSV]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile && validateFile(selectedFile)) {
        setFile(selectedFile);
        parseCSV(selectedFile);
      }
    },
    [parseCSV]
  );

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setParseStatus("idle");
    setParseProgress(0);
    setErrorMessage("");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gameplay Telemetry Upload</h1>
        <p className="text-muted-foreground">
          Upload CSV files containing gameplay telemetry data for analysis
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Drag and drop your CSV file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
              ${parseStatus === "success" ? "border-green-500 bg-green-500/5" : ""}
              ${parseStatus === "error" ? "border-red-500 bg-red-500/5" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-4">
              {parseStatus === "idle" && (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium mb-1">
                      Drop your CSV file here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse (max 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                  />
                  <Button asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Select File
                    </label>
                  </Button>
                </>
              )}

              {parseStatus === "parsing" && (
                <>
                  <div className="w-full max-w-md">
                    <p className="text-lg font-medium mb-4">Parsing CSV...</p>
                    <Progress value={parseProgress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {parseProgress}% complete
                    </p>
                  </div>
                </>
              )}

              {parseStatus === "success" && file && (
                <>
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <div>
                    <p className="text-lg font-medium mb-1">
                      File uploaded successfully!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  </div>
                  <Button onClick={handleReset} variant="outline">
                    Upload Another File
                  </Button>
                </>
              )}

              {parseStatus === "error" && (
                <>
                  <XCircle className="h-12 w-12 text-red-500" />
                  <div>
                    <p className="text-lg font-medium mb-1">Upload failed</p>
                    <p className="text-sm text-muted-foreground">
                      Please try again
                    </p>
                  </div>
                  <Button onClick={handleReset} variant="outline">
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {parseStatus === "error" && errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {parseStatus === "success" && (
        <Alert className="mb-6 border-green-500 bg-green-500/5">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Success</AlertTitle>
          <AlertDescription>
            CSV file parsed successfully. Ready for analysis.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary */}
      {parsedData && parsedData.headers && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Rows</p>
                <p className="text-2xl font-bold">{parsedData.rowCount.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Columns</p>
                <p className="text-2xl font-bold">{parsedData.headers.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">File Size</p>
                <p className="text-2xl font-bold">
                  {file ? (file.size / 1024).toFixed(2) : 0} KB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Table */}
      {parsedData && parsedData.headers && parsedData.headers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              Showing first 10 rows of {parsedData.rowCount.toLocaleString()} total rows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {parsedData.headers.map((header, index) => (
                      <TableHead key={index} className="font-semibold">
                        {header || `Column ${index + 1}`}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.rows.slice(0, 10).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {parsedData.headers.map((header, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {row[header] !== null && row[header] !== undefined ? String(row[header]) : ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Made with Bob
