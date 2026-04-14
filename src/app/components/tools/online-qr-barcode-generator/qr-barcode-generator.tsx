"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import QRCodeSVG from "react-qr-code";
import styles from "./qr-barcode-generator.module.css";
import type {
  QRDataType,
  BarcodeFormat,
  QRCodeOptions,
  BarcodeOptions,
  WiFiData,
  VCardData,
  EventData,
} from "@/app/types/qrcode";

// Import utilities
import { QR_LIMITS } from "./utils/constants";
import {
  validateURL,
  validateEmail,
  validatePhone,
  validateText,
  validateSSID,
  validateWiFiPassword,
  validateLatitude,
  validateLongitude,
  validateDateTime,
  validateBarcodeData,
} from "./utils/validation";
import {
  toIntOr,
  compressImage,
  getOptimalErrorCorrection,
  getBarcodePlaceholder,
  getBarcodeHint,
} from "./utils/helpers";

// Import components
import ErrorMessage from "./components/ErrorMessage";
import DataSizeIndicator from "./components/DataSizeIndicator";
import CloudStorageHelper from "./components/CloudStorageHelper";
import BarcodeRenderer from "./components/BarcodeRenderer";

// Import types
import type { ValidationErrors, QRBarcodeGeneratorProps } from "./types";
import QRInputFields from "./components/QRInputFields";

export default function QRBarcodeGenerator({ defaultMode = "qr" }: QRBarcodeGeneratorProps) {
  // State management
  const [mode, setMode] = useState<"qr" | "barcode">(defaultMode);
  const [dataType, setDataType] = useState<QRDataType>("text");
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>("CODE128");
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Input states
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [smsInput, setSmsInput] = useState({ phone: "", message: "" });

  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });

  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    address: "",
    website: "",
  });

  const [eventData, setEventData] = useState<EventData>({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [locationData, setLocationData] = useState({ lat: "", lng: "" });
  const [fileData, setFileData] = useState<string>("");
  const [fileName, setFileName] = useState("");

  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
    level: "M",
    includeMargin: true,
  });

  const [barcodeOptions, setBarcodeOptions] = useState<BarcodeOptions>({
    format: "CODE128",
    width: 2,
    height: 100,
    displayValue: false,
    fontSize: 20,
    lineColor: "#000000",
    background: "#ffffff",
  });

  const [generatedData, setGeneratedData] = useState("");
  const [showCloudHelper, setShowCloudHelper] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Continue in next part...
    // Update mode when defaultMode prop changes
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  // Validate all inputs
  const validateInputs = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (mode === "qr") {
      switch (dataType) {
        case "text":
          newErrors.text = validateText(textInput);
          break;
        case "url":
          newErrors.url = validateURL(urlInput);
          break;
        case "email":
          newErrors.email = validateEmail(emailInput);
          break;
        case "phone":
          newErrors.phone = validatePhone(phoneInput);
          break;
        case "sms":
          newErrors.smsPhone = validatePhone(smsInput.phone);
          newErrors.smsMessage = validateText(smsInput.message);
          break;
        case "wifi":
          newErrors.wifiSSID = validateSSID(wifiData.ssid);
          newErrors.wifiPassword = validateWiFiPassword(
            wifiData.password,
            wifiData.encryption
          );
          break;
        case "vcard":
          if (!vcardData.firstName && !vcardData.lastName) {
            newErrors.vcardFirstName = "First name or last name is required";
          }
          if (vcardData.phone) {
            newErrors.vcardPhone = validatePhone(vcardData.phone);
          }
          if (vcardData.email) {
            newErrors.vcardEmail = validateEmail(vcardData.email);
          }
          if (vcardData.website) {
            newErrors.vcardWebsite = validateURL(vcardData.website);
          }
          break;
        case "location":
          newErrors.locationLat = validateLatitude(locationData.lat);
          newErrors.locationLng = validateLongitude(locationData.lng);
          break;
        case "event":
          newErrors.eventTitle = validateText(eventData.title);
          newErrors.eventStartDate = validateDateTime(
            eventData.startDate,
            "Start date"
          );
          newErrors.eventEndDate = validateDateTime(eventData.endDate, "End date");
          
          if (
            eventData.startDate &&
            eventData.endDate &&
            new Date(eventData.startDate) > new Date(eventData.endDate)
          ) {
            newErrors.eventEndDate = "End date must be after start date";
          }
          break;
        case "image":
        case "pdf":
        case "video":
        case "file":
          if (!fileData) {
            newErrors.text = "Please upload a file";
          }
          break;
      }
    } else {
      newErrors.barcode = validateBarcodeData(textInput, barcodeFormat);
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  }, [
    mode,
    dataType,
    barcodeFormat,
    textInput,
    urlInput,
    emailInput,
    phoneInput,
    smsInput,
    wifiData,
    vcardData,
    locationData,
    eventData,
    fileData,
  ]);

  // Generate QR data
  const generateQRData = useCallback((): string => {
    switch (dataType) {
      case "text":
        return textInput;
      case "url":
        return urlInput;
      case "email":
        return `mailto:${emailInput}`;
      case "phone":
        return `tel:${phoneInput}`;
      case "sms":
        return `SMSTO:${smsInput.phone}:${smsInput.message}`;
      case "wifi":
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden};`;
      case "vcard":
        return `BEGIN:VCARD
VERSION:3.0
N:${vcardData.lastName};${vcardData.firstName}
FN:${vcardData.firstName} ${vcardData.lastName}
ORG:${vcardData.organization}
TITLE:${vcardData.title}
TEL:${vcardData.phone}
EMAIL:${vcardData.email}
ADR:${vcardData.address}
URL:${vcardData.website}
END:VCARD`;
      case "location":
        return `geo:${locationData.lat},${locationData.lng}`;
      case "event":
        return `BEGIN:VEVENT
SUMMARY:${eventData.title}
LOCATION:${eventData.location}
DTSTART:${eventData.startDate.replace(/[-:]/g, "")}
DTEND:${eventData.endDate.replace(/[-:]/g, "")}
DESCRIPTION:${eventData.description}
END:VEVENT`;
      case "image":
      case "pdf":
      case "video":
      case "file":
        return fileData;
      default:
        return textInput;
    }
  }, [
    dataType,
    textInput,
    urlInput,
    emailInput,
    phoneInput,
    smsInput,
    wifiData,
    vcardData,
    locationData,
    eventData,
    fileData,
  ]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeKB = Math.round(file.size / 1024);

    if (file.size > QR_LIMITS.DIRECT_UPLOAD.maximum) {
      const useCloud = confirm(
        `File is too large: ${fileSizeKB}KB\n\n` +
          `Maximum for direct encoding: ${Math.round(QR_LIMITS.DIRECT_UPLOAD.maximum / 1024)}KB\n\n` +
          `Would you like to see cloud storage options?\n\n` +
          `Click OK to see cloud upload guide\n` +
          `Click Cancel to choose a smaller file`,
      );

      if (useCloud) {
        setShowCloudHelper(true);
      }
      e.target.value = "";
      return;
    }

    setFileName(file.name);

    if (
      file.type.startsWith("image/") &&
      file.size > QR_LIMITS.DIRECT_UPLOAD.warning
    ) {
      const choice = confirm(
        `Image size: ${fileSizeKB}KB\n\n` +
          `Large images create complex QR codes.\n\n` +
          `Click OK to auto-compress the image\n` +
          `Click Cancel to use original size\n\n` +
          `Recommended: Click OK for better scanning`,
      );

      if (choice) {
        try {
          const compressed = await compressImage(
            file,
            QR_LIMITS.DIRECT_UPLOAD.recommended / 1024,
          );
          const compressedSize = Math.round(new Blob([compressed]).size / 1024);
          setFileData(compressed);
          setFileName(`${file.name} (compressed: ${compressedSize}KB)`);
          setErrors((prev) => ({ ...prev, text: undefined }));
          alert(
            `✅ Image compressed from ${fileSizeKB}KB to ${compressedSize}KB`,
          );
          return;
        } catch (error) {
          console.error("Compression failed:", error);
          alert("Compression failed. Using original image.");
        }
      }
    }

    if (file.size > QR_LIMITS.DIRECT_UPLOAD.warning) {
      const proceed = confirm(
        `Warning: File size is ${fileSizeKB}KB\n\n` +
          `This will create a complex QR code.\n\n` +
          `Recommendation: Use cloud storage for files over ${Math.round(QR_LIMITS.DIRECT_UPLOAD.recommended / 1024)}KB\n\n` +
          `Continue with current file?`,
      );
      if (!proceed) {
        const showGuide = confirm(
          "Would you like to see cloud storage options?",
        );
        if (showGuide) {
          setShowCloudHelper(true);
        }
        e.target.value = "";
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setFileData(base64Data);
      setErrors((prev) => ({ ...prev, text: undefined }));
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
      setFileData("");
      setFileName("");
    };

    reader.readAsDataURL(file);
  };

  // Generate QR/Barcode
  const handleGenerate = async () => {
    if (!validateInputs()) {
      return;
    }

    const data = mode === "qr" ? generateQRData() : textInput;

    if (!data || data.trim().length === 0) {
      alert("Please enter data to generate code");
      return;
    }

    if (mode === "qr") {
      const dataSize = new Blob([data]).size;
      const dataSizeKB = Math.round(dataSize / 1024);

      if (dataSize > 2953) {
        alert(
          `❌ Data is too large: ${dataSizeKB}KB\n\n` +
            `Maximum QR code capacity: ~3KB\n\n` +
            `Solutions:\n` +
            `• For URLs: Use a URL shortener (bit.ly, tinyurl.com)\n` +
            `• For files: Upload to cloud storage and encode the link\n` +
            `• For text: Summarize or split content`,
        );

        const showGuide = confirm(
          "Would you like to see cloud storage options?",
        );
        if (showGuide) {
          setShowCloudHelper(true);
        }
        return;
      }

      let optimalLevel = getOptimalErrorCorrection(dataSize);
      let actualLevel = qrOptions.level;

      if (dataSize > 1500) {
        const shouldAutoAdjust = confirm(
          `⚠️ Large data detected: ${dataSizeKB}KB\n\n` +
            `Current error correction: ${qrOptions.level}\n` +
            `Recommended: ${optimalLevel}\n\n` +
            `Click OK to use recommended level\n` +
            `Click Cancel to keep current level`,
        );

        if (shouldAutoAdjust) {
          actualLevel = optimalLevel;
          setQrOptions({ ...qrOptions, level: optimalLevel });
        }
      }

      setGeneratedData(data);

      try {
        await QRCode.toCanvas(canvasRef.current, data, {
          width: qrOptions.size,
          margin: qrOptions.includeMargin ? 4 : 0,
          color: {
            dark: qrOptions.fgColor,
            light: qrOptions.bgColor,
          },
          errorCorrectionLevel: actualLevel,
        });
      } catch (error) {
        console.error("QR generation error:", error);
        alert(
          `❌ QR Code Generation Failed\n\n` +
            `The data is too complex.\n\n` +
            `Try:\n` +
            `• Reduce data size\n` +
            `• Use cloud storage for large files`,
        );
      }
    } else {
      setGeneratedData(data);
    }
  };

  // Download handler
  const handleDownload = (format: "png" | "svg" | "jpg") => {
    if (!generatedData) {
      alert("Please generate a code first");
      return;
    }

    if (mode === "qr") {
      if (format === "png" || format === "jpg") {
        const canvas = canvasRef.current;
        if (canvas) {
          const url = canvas.toDataURL(`image/${format}`);
          const link = document.createElement("a");
          link.download = `qrcode.${format}`;
          link.href = url;
          link.click();
        }
      } else if (format === "svg") {
        const svg = document.getElementById("qr-svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "qrcode.svg";
          link.href = url;
          link.click();
        }
      }
    } else {
      const svg = document.querySelector(`.${styles.barcodeContainer} svg`);
      if (svg) {
        if (format === "svg") {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "barcode.svg";
          link.href = url;
          link.click();
        } else {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const svgData = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          const blob = new Blob([svgData], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL(`image/${format}`);
            const link = document.createElement("a");
            link.download = `barcode.${format}`;
            link.href = pngUrl;
            link.click();
            URL.revokeObjectURL(url);
          };
          img.src = url;
        }
      }
    }
  };

    // JSX Render
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          {mode === "qr" ? "🎯 QR Code Generator" : "📊 Barcode Generator"}
        </h1>
        <p>
          {mode === "qr"
            ? "Generate customizable QR codes from any type of data"
            : "Generate professional barcodes in multiple formats"}
        </p>
      </div>

      {/* Mode Selection */}
      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeBtn} ${mode === "qr" ? styles.active : ""}`}
          onClick={() => {
            setMode("qr");
            setErrors({});
          }}
        >
          📱 QR Code
        </button>
        <button
          className={`${styles.modeBtn} ${mode === "barcode" ? styles.active : ""}`}
          onClick={() => {
            setMode("barcode");
            setErrors({});
          }}
        >
          📊 Barcode
        </button>
      </div>

      <div className={styles.content}>
        {/* Left Panel - Input */}
        <div className={styles.inputPanel}>
          {mode === "qr" ? (
            <>
              <h2>QR Code Settings</h2>

              {/* Data Type Selector */}
              <div className={styles.formGroup}>
                <label>Data Type</label>
                <select
                  value={dataType}
                  onChange={(e) => {
                    setDataType(e.target.value as QRDataType);
                    setErrors({});
                  }}
                  className={styles.select}
                >
                  <option value="text">📝 Plain Text</option>
                  <option value="url">🔗 URL/Link</option>
                  <option value="email">📧 Email</option>
                  <option value="phone">📞 Phone Number</option>
                  <option value="sms">💬 SMS</option>
                  <option value="wifi">📶 WiFi</option>
                  <option value="vcard">👤 Contact Card (vCard)</option>
                  <option value="location">📍 Location</option>
                  <option value="event">📅 Event</option>
                  <option value="image">🖼️ Image</option>
                  <option value="pdf">📄 PDF</option>
                  <option value="video">🎥 Video</option>
                  <option value="file">📎 File</option>
                </select>
              </div>

              {/* QR Input Fields Component */}
              <QRInputFields
                dataType={dataType}
                textInput={textInput}
                setTextInput={setTextInput}
                urlInput={urlInput}
                setUrlInput={setUrlInput}
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                phoneInput={phoneInput}
                setPhoneInput={setPhoneInput}
                smsInput={smsInput}
                setSmsInput={setSmsInput}
                wifiData={wifiData}
                setWifiData={setWifiData}
                vcardData={vcardData}
                setVcardData={setVcardData}
                eventData={eventData}
                setEventData={setEventData}
                locationData={locationData}
                setLocationData={setLocationData}
                fileData={fileData}
                fileName={fileName}
                handleFileUpload={handleFileUpload}
                setShowCloudHelper={setShowCloudHelper}
                errors={errors}
                setErrors={setErrors}
              />

              {/* QR Options */}
              <div className={styles.optionsSection}>
                <h3>Appearance</h3>
                <div className={styles.optionsGrid}>
                  <div className={styles.formGroup}>
                    <label>Size</label>
                    <input
                      type="number"
                      value={qrOptions.size}
                      onChange={(e) => {
                        const next = toIntOr(
                          qrOptions.size,
                          e.target.value,
                          128,
                          1024,
                        );
                        setQrOptions((o) => ({ ...o, size: next }));
                      }}
                      onBlur={(e) => {
                        const next = toIntOr(
                          qrOptions.size,
                          e.target.value,
                          128,
                          1024,
                        );
                        setQrOptions((o) => ({ ...o, size: next || 256 }));
                      }}
                      min={128}
                      max={1024}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Error Correction</label>
                    <select
                      value={qrOptions.level}
                      onChange={(e) =>
                        setQrOptions({
                          ...qrOptions,
                          level: e.target.value as "L" | "M" | "Q" | "H",
                        })
                      }
                      className={styles.select}
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Foreground Color</label>
                    <input
                      type="color"
                      value={qrOptions.fgColor}
                      onChange={(e) =>
                        setQrOptions({ ...qrOptions, fgColor: e.target.value })
                      }
                      className={styles.colorInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Background Color</label>
                    <input
                      type="color"
                      value={qrOptions.bgColor}
                      onChange={(e) =>
                        setQrOptions({ ...qrOptions, bgColor: e.target.value })
                      }
                      className={styles.colorInput}
                    />
                  </div>
                  <div
                    className={styles.formGroup}
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={qrOptions.includeMargin}
                        onChange={(e) =>
                          setQrOptions({
                            ...qrOptions,
                            includeMargin: e.target.checked,
                          })
                        }
                      />
                      <span style={{ marginLeft: 8 }}>Include Margin</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2>Barcode Settings</h2>

              {/* Barcode Format */}
              <div className={styles.formGroup}>
                <label>Barcode Format</label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => {
                    const format = e.target.value as BarcodeFormat;
                    setBarcodeFormat(format);
                    setBarcodeOptions({ ...barcodeOptions, format });
                    setErrors({});
                  }}
                  className={styles.select}
                >
                  <option value="CODE128">CODE128 (Alphanumeric)</option>
                  <option value="CODE128A">CODE128A</option>
                  <option value="CODE128B">CODE128B</option>
                  <option value="CODE128C">CODE128C (Numeric)</option>
                  <option value="EAN13">EAN13 (13 digits)</option>
                  <option value="EAN8">EAN8 (8 digits)</option>
                  <option value="UPC">UPC (12 digits)</option>
                  <option value="UPCE">UPC-E (8 digits)</option>
                  <option value="CODE39">CODE39</option>
                  <option value="ITF14">ITF14 (14 digits)</option>
                  <option value="ITF">ITF</option>
                  <option value="MSI">MSI</option>
                  <option value="MSI10">MSI10</option>
                  <option value="MSI11">MSI11</option>
                  <option value="MSI1010">MSI1010</option>
                  <option value="MSI1110">MSI1110</option>
                  <option value="pharmacode">Pharmacode</option>
                  <option value="codabar">Codabar</option>
                </select>
              </div>

              {/* Barcode Data */}
              <div className={styles.formGroup}>
                <label>Barcode Data</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    setErrors((prev) => ({ ...prev, barcode: undefined }));
                  }}
                  onBlur={() => {
                    const error = validateBarcodeData(textInput, barcodeFormat);
                    setErrors((prev) => ({ ...prev, barcode: error }));
                  }}
                  placeholder={getBarcodePlaceholder(barcodeFormat)}
                  className={`${styles.input} ${errors.barcode ? styles.inputError : ""}`}
                />
                <ErrorMessage message={errors.barcode} />
                <p className={styles.hint}>{getBarcodeHint(barcodeFormat)}</p>
              </div>

              {/* Barcode Options */}
              <div className={styles.optionsSection}>
                <h3>Appearance</h3>
                <div className={styles.optionsGrid}>
                  <div className={styles.formGroup}>
                    <label>Width</label>
                    <input
                      type="number"
                      value={barcodeOptions.width}
                      onChange={(e) =>
                        setBarcodeOptions({
                          ...barcodeOptions,
                          width: parseInt(e.target.value) || 2,
                        })
                      }
                      min={1}
                      max={5}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Height</label>
                    <input
                      type="number"
                      value={barcodeOptions.height}
                      onChange={(e) =>
                        setBarcodeOptions({
                          ...barcodeOptions,
                          height: parseInt(e.target.value) || 100,
                        })
                      }
                      min={50}
                      max={200}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Font Size</label>
                    <input
                      type="number"
                      value={barcodeOptions.fontSize}
                      onChange={(e) =>
                        setBarcodeOptions({
                          ...barcodeOptions,
                          fontSize: parseInt(e.target.value) || 20,
                        })
                      }
                      min={10}
                      max={30}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Line Color</label>
                    <input
                      type="color"
                      value={barcodeOptions.lineColor}
                      onChange={(e) =>
                        setBarcodeOptions({
                          ...barcodeOptions,
                          lineColor: e.target.value,
                        })
                      }
                      className={styles.colorInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Background</label>
                    <input
                      type="color"
                      value={barcodeOptions.background}
                      onChange={(e) =>
                        setBarcodeOptions({
                          ...barcodeOptions,
                          background: e.target.value,
                        })
                      }
                      className={styles.colorInput}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Generate Button */}
          <button onClick={handleGenerate} className={styles.generateBtn}>
            ✨ Generate {mode === "qr" ? "QR Code" : "Barcode"}
          </button>

          {/* Data Size Indicator */}
          {mode === "qr" && <DataSizeIndicator data={generateQRData()} />}
        </div>

        {/* Right Panel - Preview */}
        <div className={styles.previewPanel}>
          <h2>Preview</h2>

          {generatedData ? (
            <div className={styles.preview}>
              {mode === "qr" ? (
                <div className={styles.qrPreview}>
                  <canvas ref={canvasRef} className={styles.canvas} />
                  <div style={{ display: "none" }}>
                    <QRCodeSVG
                      id="qr-svg"
                      value={String(generatedData ?? "")}
                      size={
                        Number.isFinite(qrOptions.size) ? qrOptions.size : 256
                      }
                      fgColor={qrOptions.fgColor}
                      bgColor={qrOptions.bgColor}
                      level={qrOptions.level}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.barcodeContainer}>
                  <BarcodeRenderer
                    value={generatedData}
                    format={barcodeOptions.format}
                    width={barcodeOptions.width}
                    height={barcodeOptions.height}
                    displayValue={barcodeOptions.displayValue}
                    fontSize={barcodeOptions.fontSize}
                    lineColor={barcodeOptions.lineColor}
                    background={barcodeOptions.background}
                  />
                </div>
              )}

              {/* Download Buttons */}
              <div className={styles.downloadButtons}>
                <button
                  onClick={() => handleDownload("png")}
                  className={styles.downloadBtn}
                >
                  📥 Download PNG
                </button>
                <button
                  onClick={() => handleDownload("svg")}
                  className={styles.downloadBtn}
                >
                  📥 Download SVG
                </button>
                <button
                  onClick={() => handleDownload("jpg")}
                  className={styles.downloadBtn}
                >
                  📥 Download JPG
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyPreview}>
              <div className={styles.emptyIcon}>
                {mode === "qr" ? "📱" : "📊"}
              </div>
              <p>
                Generate a {mode === "qr" ? "QR code" : "barcode"} to see
                preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        <h3>ℹ️ Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h4>{mode === "qr" ? "QR Codes" : "Barcodes"}</h4>
            <p>
              {mode === "qr"
                ? "QR codes can store various types of data including URLs, text, contact information, WiFi credentials, and more. They can be scanned by smartphones and QR code readers."
                : "Barcodes are used primarily for product identification and inventory management. Different formats have different use cases and data capacity."}
            </p>
          </div>
          <div className={styles.infoCard}>
            <h4>{mode === "qr" ? "Error Correction" : "Format Standards"}</h4>
            <p>
              {mode === "qr"
                ? "Higher error correction levels make QR codes more resilient to damage but also make them more complex. Use 'H' for codes that might get damaged."
                : "Each barcode format follows specific industry standards. EAN/UPC for retail, CODE128 for logistics, ITF14 for shipping containers."}
            </p>
          </div>
          <div className={styles.infoCard}>
            <h4>{mode === "qr" ? "File Support" : "Data Requirements"}</h4>
            <p>
              {mode === "qr"
                ? "When encoding files, they are converted to Base64. Very large files will create complex QR codes that may be difficult to scan. For files over 512KB, use cloud storage."
                : "Different barcode formats have specific data requirements. Some accept only numeric data, others allow alphanumeric. Always validate your data before generating."}
            </p>
          </div>
          <div className={styles.infoCard}>
            <h4>Download Formats</h4>
            <p>
              All codes can be downloaded in PNG, SVG, and JPG formats. SVG is recommended for printing as it provides infinite scalability without quality loss.
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Storage Helper Modal */}
      {showCloudHelper && (
        <CloudStorageHelper onClose={() => setShowCloudHelper(false)} />
      )}
    </div>
  );
}