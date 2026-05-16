"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle, Sparkles } from "lucide-react";
import { generateAnalyticsSummary, AnalyticsSummary, TelemetryRow } from "@/lib/analytics";
import { generateMockInsights, AIInsights } from "@/lib/legacy/mockAI";
import { InsightsDashboard } from "@/components/insights/InsightsDashboard";

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
  
  // Analytics state
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

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
   */
  const parseCSV = useCallback((file: File) => {
    setParseStatus("parsing");
    setParseProgress(0);
    setErrorMessage("");
    setShowInsights(false);
    setAIInsights(null);
    setAnalyticsSummary(null);

    // Use FileReader to read the file as text first
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      if (!text) {
        setErrorMessage("Failed to read file content.");
        setParseStatus("error");
        return;
      }

      // Trim UTF-8 BOM if present
      const trimmedText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
      
      let rowsParsed = 0;
      const estimatedRows = Math.ceil(file.size / 100);
      const parsedRows: Record<string, any>[] = [];

      // Parse the text content with PapaParse
      Papa.parse<any>(trimmedText, {
        delimiter: "",
        header: true,
        skipEmptyLines: true,
        worker: false,
        fastMode: false,
        dynamicTyping: true,
        quoteChar: '"',
        escapeChar: '\\',
        comments: false,
        delimitersToGuess: [',', '\t', '|', ';'],
        
        step: (row) => {
          if (row.data && Object.keys(row.data).length > 0) {
            parsedRows.push(row.data);
          }
          
          rowsParsed++;
          const progress = Math.min(
            Math.round((rowsParsed / estimatedRows) * 100),
            99
          );
          setParseProgress(progress);
        },
        
        complete: (results) => {
          if (!results) {
            setErrorMessage("Parse error: No results returned from parser.");
            setParseStatus("error");
            return;
          }
          
          if (results.errors && results.errors.length > 0) {
            console.warn("Parse errors detected (continuing anyway):", results.errors);
          }

          if (!parsedRows || parsedRows.length === 0) {
            setErrorMessage("CSV file appears to be empty or contains no valid data.");
            setParseStatus("error");
            return;
          }

          const headers =
            results.meta?.fields ||
            (parsedRows.length > 0 ? Object.keys(parsedRows[0]) : []);
          
          if (headers.length === 0) {
            setErrorMessage("Unable to parse CSV file. No headers detected.");
            setParseStatus("error");
            return;
          }
          
          const filteredRows = parsedRows.filter((row) => {
            const hasData = Object.values(row).some((value) => {
              if (value === null || value === undefined) return false;
              if (value === "") return false;
              return true;
            });
            return hasData;
          });

          const finalRows = filteredRows.length > 0 ? filteredRows : parsedRows;
          
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
    setShowInsights(false);
    setAIInsights(null);
    setAnalyticsSummary(null);
  };

  // Generate analytics and insights when data is parsed
  const handleGenerateInsights = async () => {
    if (!parsedData || !parsedData.rows) return;
    
    setIsGeneratingInsights(true);
    
    try {
      // Generate analytics summary
      const summary = generateAnalyticsSummary(parsedData.rows as TelemetryRow[]);
      setAnalyticsSummary(summary);
      
      // Generate AI insights (mock)
      const insights = await generateMockInsights(summary);
      setAIInsights(insights);
      setShowInsights(true);
    } catch (error) {
      console.error("Error generating insights:", error);
      setErrorMessage("Failed to generate insights. Please try again.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Retain AI
            </h1>
            <p className="text-sm font-medium text-primary mt-0.5">
              AI-Powered LiveOps & Retention Intelligence
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-base ml-[60px]">
          Upload gameplay telemetry data to generate actionable insights for player retention and monetization
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            
            {!showInsights && (
              <Button 
                onClick={handleGenerateInsights} 
                disabled={isGeneratingInsights}
                className="w-full"
                size="lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isGeneratingInsights ? "Generating Insights..." : "Generate AI Insights"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Insights Dashboard */}
      {showInsights && analyticsSummary && (
        <div className="mb-6">
          <InsightsDashboard 
            insights={aiInsights}
            summary={analyticsSummary}
            isLoading={isGeneratingInsights}
          />
        </div>
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
