export type QRDataType = 
  | 'text' 
  | 'url' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'wifi' 
  | 'vcard' 
  | 'location' 
  | 'event'
  | 'image'
  | 'pdf'
  | 'video'
  | 'file';

// Fixed: Match exact types from react-barcode library
export type BarcodeFormat = 
  | 'CODE128' 
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'UPC'
  | 'UPCE'
  | 'CODE39' 
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode' // lowercase!
  | 'codabar'
  | 'GenericBarcode';

export interface QRCodeOptions {
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
}

export interface BarcodeOptions {
  format: BarcodeFormat;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  lineColor: string;
  background: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  website: string;
}

export interface EventData {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}