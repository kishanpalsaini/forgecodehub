import type { BarcodeFormat } from "@/app/types/qrcode";

export function validateURL(url: string): string | undefined {
  if (!url) return "URL is required";
  if (url.trim().length === 0) return "URL cannot be empty";
  
  try {
    new URL(url);
    if (!url.match(/^https?:\/\//i)) {
      return "URL must start with http:// or https://";
    }
    return undefined;
  } catch {
    return "Please enter a valid URL (e.g., https://example.com)";
  }
}

export function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required";
  if (email.trim().length === 0) return "Email cannot be empty";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  if (!phone) return "Phone number is required";
  if (phone.trim().length === 0) return "Phone number cannot be empty";
  
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "Please enter a valid phone number (e.g., +1234567890)";
  }
  return undefined;
}

export function validateText(text: string): string | undefined {
  if (!text) return "Text is required";
  if (text.trim().length === 0) return "Text cannot be empty";
  if (text.length > 2000) return "Text is too long (max 2000 characters)";
  return undefined;
}

export function validateSSID(ssid: string): string | undefined {
  if (!ssid) return "Network name (SSID) is required";
  if (ssid.trim().length === 0) return "SSID cannot be empty";
  if (ssid.length > 32) return "SSID must be 32 characters or less";
  return undefined;
}

export function validateWiFiPassword(password: string, encryption: string): string | undefined {
  if (encryption === "nopass") return undefined;
  if (!password) return "Password is required for secured networks";
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
}

export function validateLatitude(lat: string): string | undefined {
  if (!lat) return "Latitude is required";
  const latNum = parseFloat(lat);
  if (isNaN(latNum)) return "Latitude must be a number";
  if (latNum < -90 || latNum > 90) return "Latitude must be between -90 and 90";
  return undefined;
}

export function validateLongitude(lng: string): string | undefined {
  if (!lng) return "Longitude is required";
  const lngNum = parseFloat(lng);
  if (isNaN(lngNum)) return "Longitude must be a number";
  if (lngNum < -180 || lngNum > 180) return "Longitude must be between -180 and 180";
  return undefined;
}

export function validateDateTime(dateTime: string, fieldName: string): string | undefined {
  if (!dateTime) return `${fieldName} is required`;
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
  return undefined;
}

export function validateBarcodeData(data: string, format: BarcodeFormat): string | undefined {
  if (!data) return "Barcode data is required";
  if (data.trim().length === 0) return "Barcode data cannot be empty";

  const numericOnly = /^\d+$/;
  
  switch (format) {
    case "EAN13":
      if (!numericOnly.test(data)) return "EAN13 requires only digits";
      if (data.length !== 12 && data.length !== 13) return "EAN13 requires exactly 12 or 13 digits";
      break;
      
    case "EAN8":
      if (!numericOnly.test(data)) return "EAN8 requires only digits";
      if (data.length !== 7 && data.length !== 8) return "EAN8 requires exactly 7 or 8 digits";
      break;
      
    case "EAN5":
      if (!numericOnly.test(data)) return "EAN5 requires only digits";
      if (data.length !== 5) return "EAN5 requires exactly 5 digits";
      break;
      
    case "EAN2":
      if (!numericOnly.test(data)) return "EAN2 requires only digits";
      if (data.length !== 2) return "EAN2 requires exactly 2 digits";
      break;
      
    case "UPC":
      if (!numericOnly.test(data)) return "UPC requires only digits";
      if (data.length !== 11 && data.length !== 12) return "UPC requires exactly 11 or 12 digits";
      break;
      
    case "UPCE":
      if (!numericOnly.test(data)) return "UPC-E requires only digits";
      if (data.length !== 6 && data.length !== 7 && data.length !== 8) {
        return "UPC-E requires 6, 7, or 8 digits";
      }
      break;
      
    case "ITF14":
      if (!numericOnly.test(data)) return "ITF14 requires only digits";
      if (data.length !== 14) return "ITF14 requires exactly 14 digits";
      break;
      
    case "ITF":
      if (!numericOnly.test(data)) return "ITF requires only digits";
      if (data.length % 2 !== 0) return "ITF requires an even number of digits";
      break;
      
    case "CODE128C":
      if (!numericOnly.test(data)) return "CODE128C requires only digits";
      if (data.length % 2 !== 0) return "CODE128C requires an even number of digits";
      break;
      
    case "MSI":
    case "MSI10":
    case "MSI11":
    case "MSI1010":
    case "MSI1110":
      if (!numericOnly.test(data)) return `${format} requires only digits`;
      break;
      
    case "pharmacode":
      if (!numericOnly.test(data)) return "Pharmacode requires only digits";
      const pharmacodeNum = parseInt(data);
      if (pharmacodeNum < 3 || pharmacodeNum > 131070) {
        return "Pharmacode must be between 3 and 131070";
      }
      break;
      
    case "CODE39":
      if (!/^[0-9A-Z\-. $/+%]+$/.test(data)) {
        return "CODE39 allows only: 0-9, A-Z, -, ., space, $, /, +, %";
      }
      break;
      
    case "codabar":
      if (!/^[0-9\-$:/.+]+$/.test(data)) {
        return "Codabar allows only: 0-9, -, $, :, /, ., +";
      }
      break;
  }
  
  return undefined;
}