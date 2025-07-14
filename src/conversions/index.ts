import { ConversionRule } from '../types';
import { browserConversions } from './browser-conversions';
import { browserInitConversions } from './browser-init-conversions';
import { elementFindingConversions } from './element-finding-conversions';
import { elementInteractionConversions } from './element-interaction-conversions';
import { keyboardConversions } from './keyboard-conversions';
import { mouseConversions } from './mouse-conversions';
import { waitConversions } from './wait-conversions';
import { waitConditionConversions } from './wait-condition-conversions';
import { screenshotConversions } from './screenshot-conversions';
import { navigationConversions } from './navigation-conversions';
import { advancedInteractions } from './advanced-interactions';
import { pageStateConversions } from './page-state-conversions';
import { javascriptExecutionConversions } from './javascript-execution-conversions';
import { cookieConversions } from './cookie-conversions';
import { advancedDragDropConversions } from './advanced-drag-drop';
import { touchConversions } from './touch-conversions';
import { pauseConversions } from './pause-conversions';
import { windowManagementConversions } from './window-management-conversions';
import { networkConversions } from './network-conversions';
import { geolocationPermissionsConversions } from './geolocation-permissions-conversions';
import { fileHandlingConversions } from './file-handling-conversions';
import { mobileEmulationConversions } from './mobile-emulation-conversions';
import { dialogHandlingConversions } from './dialog-handling-conversions';
import { performanceLoggingConversions } from './performance-logging-conversions';
import { selenium4ModernConversions } from './selenium4-modern-conversions';
import { playwrightModernConversions } from './playwright-modern-conversions';
import { frameConversions } from './frame-conversions';

// Combine all conversion rules with their priorities
const allConversions: ConversionRule[] = [
  // Selenium 4 modern features (highest priority)
  ...selenium4ModernConversions,

  // Playwright modern features (highest priority)
  ...playwrightModernConversions,

  // Browser initialization (very high priority - needs to run first)
  ...browserInitConversions,

  // File handling conversions (high priority)
  ...fileHandlingConversions,

  // Dialog handling conversions (high priority)
  ...dialogHandlingConversions,

  // Frame handling conversions (high priority)
  ...frameConversions,

  // Mobile emulation conversions (high priority)
  ...mobileEmulationConversions,

  // Network-related conversions (high priority)
  ...networkConversions,

  // Browser-related conversions (high priority)
  ...browserConversions,

  // Navigation conversions (high priority)
  ...navigationConversions,

  // Page state conversions (high priority)
  ...pageStateConversions,

  // Element finding (high priority as other conversions depend on these)
  ...elementFindingConversions,

  // Screenshot and page info (high priority)
  ...screenshotConversions,

  // Performance logging conversions (medium priority)
  ...performanceLoggingConversions,

  // Geolocation and permissions conversions (medium priority)
  ...geolocationPermissionsConversions,

  // Wait conditions (medium priority)
  ...waitConditionConversions,

  // Waits and conditions (medium priority)
  ...waitConversions,

  // Advanced interactions (lower priority)
  ...advancedInteractions,

  // Pause conversions (lower priority)
  ...pauseConversions,

  // Window management conversions (lower priority)
  ...windowManagementConversions,

  // Element interactions (medium priority)
  ...elementInteractionConversions,

  // Touch actions (medium priority, after mouse interactions)
  ...touchConversions,

  // JavaScript execution conversions (medium priority)
  ...javascriptExecutionConversions,

  // Cookie management (medium priority)
  ...cookieConversions,

  // Advanced drag and drop (high priority)
  ...advancedDragDropConversions,

  // Keyboard and mouse actions (lower priority)
  ...keyboardConversions,
  ...mouseConversions,
];

// Sort all conversions by priority (highest first)
const sortedConversions = [...allConversions].sort((a, b) => (b.priority || 0) - (a.priority || 0));

export {
  browserConversions,
  elementFindingConversions,
  elementInteractionConversions,
  keyboardConversions,
  mouseConversions,
  waitConversions,
  waitConditionConversions,
  screenshotConversions,
  browserInitConversions,
  navigationConversions,
  advancedInteractions,
  sortedConversions as conversions,
};
