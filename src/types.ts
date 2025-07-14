export interface ConversionRule {
  pattern: RegExp;
  replacement: string | ((match: string, driver: string, ...args: string[]) => string);
  description: string;
  priority: number;
  category?: string;
  requiresManualReview?: boolean;
  warning?: string;
}

export interface ConversionResult {
  convertedCode: string;
  appliedRules: string[];
  warnings: string[];
  requiresManualReview: boolean;
  conversionStats: ConversionStatistics;
}

export interface ConversionStatistics {
  // Pattern matching statistics
  seleniumPatternsFound: number;
  playwrightPatternsFound: number;

  // Code metrics
  originalLineCount: number;
  convertedLineCount: number;

  // Conversion metrics
  estimatedEffort: 'low' | 'medium' | 'high';
  complexityScore: number;
  rulesApplied: number;
  totalConversions: number;
  byCategory: Record<string, number>;

  // Categorization
  categories: Record<string, number>;

  // Review status
  manualReviewNeeded: boolean;

  // Metadata
  timestamp: string;
}

export interface DirectoryConversionResult {
  files: string[];
  stats: ConversionStatistics;
  processedFiles: number;
  totalRulesApplied: number;
  filesRequiringReview: number;
  warnings: string[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

export interface ConversionContext {
  filePath?: string;
  isTestFile?: boolean;
  customImports?: string[];
  customSetup?: string[];
  customTeardown?: string[];
}

// Helper type for tracking applied rules
type AppliedRule = {
  description: string;
  category?: string;
  requiresManualReview?: boolean;
};

export interface ConversionContext {
  appliedRules: AppliedRule[];
  warnings: string[];
  requiresManualReview: boolean;
  stats: ConversionStatistics;
}
