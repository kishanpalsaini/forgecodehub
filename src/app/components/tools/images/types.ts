// types.ts
export type ConvertFrom = 
  | "jpg" 
  | "png" 
  | "webp" 
  | "gif" 
  | "bmp" 
  | "tiff" 
  | "svg" 
  | "ico" 
  | "heic" 
  | "avif";

export type ConvertTo = 
  | "jpg" 
  | "png" 
  | "webp" 
  | "gif" 
  | "bmp" 
  | "tiff" 
  | "svg" 
  | "ico" 
  | "avif" 
  | "pdf" 
  | "rotate";

export type Quality = "low" | "medium" | "high";
export type PageSize = "a4" | "letter" | "a3";
export type Orientation = "portrait" | "landscape";

export interface FormatOption {
  value: ConvertFrom | ConvertTo;
  label: string;
  accept?: string;
  mime?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}