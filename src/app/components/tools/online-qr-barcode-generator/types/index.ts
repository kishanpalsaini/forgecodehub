export interface ValidationErrors {
  text?: string;
  url?: string;
  email?: string;
  phone?: string;
  smsPhone?: string;
  smsMessage?: string;
  wifiSSID?: string;
  wifiPassword?: string;
  vcardFirstName?: string;
  vcardLastName?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  vcardWebsite?: string;
  locationLat?: string;
  locationLng?: string;
  eventTitle?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  barcode?: string;
}

export interface QRBarcodeGeneratorProps {
  defaultMode?: "qr" | "barcode";
}