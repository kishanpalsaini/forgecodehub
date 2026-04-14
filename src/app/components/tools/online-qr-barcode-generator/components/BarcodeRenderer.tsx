import Barcode from "react-barcode";
import type { BarcodeFormat } from "@/app/types/qrcode";

interface BarcodeRendererProps {
  value: string;
  format: BarcodeFormat;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  lineColor: string;
  background: string;
}

export default function BarcodeRenderer({
  value,
  format,
  width,
  height,
  displayValue,
  fontSize,
  lineColor,
  background,
}: BarcodeRendererProps) {
  try {
    return (
      <Barcode
        value={value}
        format={format}
        width={width}
        height={height}
        displayValue={displayValue}
        fontSize={fontSize}
        lineColor={lineColor}
        background={background}
      />
    );
  } catch (error) {
    return (
      <div style={{ padding: "20px", color: "#e53e3e", textAlign: "center" }}>
        <p>
          <strong>⚠️ Invalid barcode data</strong>
        </p>
        <p style={{ fontSize: "14px", marginTop: "10px" }}>
          {format === "EAN13" && "EAN13 requires exactly 12 or 13 digits"}
          {format === "EAN8" && "EAN8 requires exactly 7 or 8 digits"}
          {format === "UPC" && "UPC requires exactly 11 or 12 digits"}
          {format === "UPCE" && "UPC-E requires exactly 6, 7, or 8 digits"}
          {format === "ITF14" && "ITF14 requires exactly 14 digits"}
          {format === "CODE128C" && "CODE128C requires even number of digits"}
          {!["EAN13", "EAN8", "UPC", "UPCE", "ITF14", "CODE128C"].includes(
            format,
          ) && "Please check your input data"}
        </p>
      </div>
    );
  }
}