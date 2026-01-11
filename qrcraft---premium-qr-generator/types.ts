
export enum InputType {
  URL = 'URL',
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE'
}

export interface QRConfig {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
}

export interface ScanEvent {
  id: string;
  timestamp: number;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  location: string;
}

export interface HistoryItem {
  id: string;
  value: string;
  timestamp: number;
  type: InputType;
  scanCount: number;
  lastScannedAt?: number;
  events: ScanEvent[];
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}
