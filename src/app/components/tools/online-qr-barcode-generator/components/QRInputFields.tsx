import type { Dispatch, SetStateAction } from "react";
import type { QRDataType, WiFiData, VCardData, EventData } from "@/app/types/qrcode";
import type { ValidationErrors } from "../types";
import ErrorMessage from "./ErrorMessage";
import { QR_LIMITS } from "../utils/constants";
import {
  validateText,
  validateURL,
  validateEmail,
  validatePhone,
  validateSSID,
  validateWiFiPassword,
  validateLatitude,
  validateLongitude,
  validateDateTime,
} from "../utils/validation";
import styles from "../qr-barcode-generator.module.css";

interface QRInputFieldsProps {
  dataType: QRDataType;
  textInput: string;
  setTextInput: Dispatch<SetStateAction<string>>;
  urlInput: string;
  setUrlInput: Dispatch<SetStateAction<string>>;
  emailInput: string;
  setEmailInput: Dispatch<SetStateAction<string>>;
  phoneInput: string;
  setPhoneInput: Dispatch<SetStateAction<string>>;
  smsInput: { phone: string; message: string };
  setSmsInput: Dispatch<SetStateAction<{ phone: string; message: string }>>;
  wifiData: WiFiData;
  setWifiData: Dispatch<SetStateAction<WiFiData>>;
  vcardData: VCardData;
  setVcardData: Dispatch<SetStateAction<VCardData>>;
  eventData: EventData;
  setEventData: Dispatch<SetStateAction<EventData>>;
  locationData: { lat: string; lng: string };
  setLocationData: Dispatch<SetStateAction<{ lat: string; lng: string }>>;
  fileData: string;
  fileName: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowCloudHelper: Dispatch<SetStateAction<boolean>>;
  errors: ValidationErrors;
  setErrors: Dispatch<SetStateAction<ValidationErrors>>;
}

export default function QRInputFields({
  dataType,
  textInput,
  setTextInput,
  urlInput,
  setUrlInput,
  emailInput,
  setEmailInput,
  phoneInput,
  setPhoneInput,
  smsInput,
  setSmsInput,
  wifiData,
  setWifiData,
  vcardData,
  setVcardData,
  eventData,
  setEventData,
  locationData,
  setLocationData,
  fileData,
  fileName,
  handleFileUpload,
  setShowCloudHelper,
  errors,
  setErrors,
}: QRInputFieldsProps) {
  return (
    <>
      {/* TEXT INPUT */}
      {dataType === "text" && (
        <div className={styles.formGroup}>
          <label>Text</label>
          <textarea
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setErrors((prev) => ({ ...prev, text: undefined }));
            }}
            onBlur={() => {
              const error = validateText(textInput);
              setErrors((prev) => ({ ...prev, text: error }));
            }}
            placeholder="Enter text..."
            rows={4}
            className={`${styles.textarea} ${errors.text ? styles.inputError : ""}`}
          />
          <ErrorMessage message={errors.text} />
        </div>
      )}

      {/* URL INPUT */}
      {dataType === "url" && (
        <div className={styles.formGroup}>
          <label>URL</label>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setErrors((prev) => ({ ...prev, url: undefined }));
            }}
            onBlur={() => {
              const error = validateURL(urlInput);
              setErrors((prev) => ({ ...prev, url: error }));
            }}
            placeholder="https://example.com"
            className={`${styles.input} ${errors.url ? styles.inputError : ""}`}
          />
          <ErrorMessage message={errors.url} />
        </div>
      )}

      {/* EMAIL INPUT */}
      {dataType === "email" && (
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            onBlur={() => {
              const error = validateEmail(emailInput);
              setErrors((prev) => ({ ...prev, email: error }));
            }}
            placeholder="email@example.com"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          />
          <ErrorMessage message={errors.email} />
        </div>
      )}

      {/* PHONE INPUT */}
      {dataType === "phone" && (
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => {
              setPhoneInput(e.target.value);
              setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            onBlur={() => {
              const error = validatePhone(phoneInput);
              setErrors((prev) => ({ ...prev, phone: error }));
            }}
            placeholder="+1234567890"
            className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
          />
          <ErrorMessage message={errors.phone} />
        </div>
      )}

      {/* SMS INPUT */}
      {dataType === "sms" && (
        <>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={smsInput.phone}
              onChange={(e) => {
                setSmsInput({ ...smsInput, phone: e.target.value });
                setErrors((prev) => ({ ...prev, smsPhone: undefined }));
              }}
              onBlur={() => {
                const error = validatePhone(smsInput.phone);
                setErrors((prev) => ({ ...prev, smsPhone: error }));
              }}
              placeholder="+1234567890"
              className={`${styles.input} ${errors.smsPhone ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.smsPhone} />
          </div>
          <div className={styles.formGroup}>
            <label>Message</label>
            <textarea
              value={smsInput.message}
              onChange={(e) => {
                setSmsInput({ ...smsInput, message: e.target.value });
                setErrors((prev) => ({ ...prev, smsMessage: undefined }));
              }}
              onBlur={() => {
                const error = validateText(smsInput.message);
                setErrors((prev) => ({ ...prev, smsMessage: error }));
              }}
              placeholder="Enter SMS message..."
              rows={3}
              className={`${styles.textarea} ${errors.smsMessage ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.smsMessage} />
          </div>
        </>
      )}

      {/* WIFI INPUT */}
      {dataType === "wifi" && (
        <>
          <div className={styles.formGroup}>
            <label>Network Name (SSID)</label>
            <input
              type="text"
              value={wifiData.ssid}
              onChange={(e) => {
                setWifiData({ ...wifiData, ssid: e.target.value });
                setErrors((prev) => ({ ...prev, wifiSSID: undefined }));
              }}
              onBlur={() => {
                const error = validateSSID(wifiData.ssid);
                setErrors((prev) => ({ ...prev, wifiSSID: error }));
              }}
              placeholder="MyWiFi"
              className={`${styles.input} ${errors.wifiSSID ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.wifiSSID} />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="text"
              value={wifiData.password}
              onChange={(e) => {
                setWifiData({ ...wifiData, password: e.target.value });
                setErrors((prev) => ({ ...prev, wifiPassword: undefined }));
              }}
              onBlur={() => {
                const error = validateWiFiPassword(
                  wifiData.password,
                  wifiData.encryption
                );
                setErrors((prev) => ({ ...prev, wifiPassword: error }));
              }}
              placeholder="********"
              className={`${styles.input} ${errors.wifiPassword ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.wifiPassword} />
          </div>
          <div className={styles.formGroup}>
            <label>Encryption</label>
            <select
              value={wifiData.encryption}
              onChange={(e) => {
                setWifiData({
                  ...wifiData,
                  encryption: e.target.value as "WPA" | "WEP" | "nopass",
                });
                setErrors((prev) => ({ ...prev, wifiPassword: undefined }));
              }}
              className={styles.select}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) =>
                  setWifiData({ ...wifiData, hidden: e.target.checked })
                }
              />
              <span style={{ marginLeft: 8 }}>Hidden Network</span>
            </label>
          </div>
        </>
      )}

      {/* VCARD INPUT */}
      {dataType === "vcard" && (
        <div className={styles.vcardGrid}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              value={vcardData.firstName}
              onChange={(e) => {
                setVcardData({ ...vcardData, firstName: e.target.value });
                setErrors((prev) => ({ ...prev, vcardFirstName: undefined }));
              }}
              placeholder="John"
              className={`${styles.input} ${errors.vcardFirstName ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.vcardFirstName} />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={vcardData.lastName}
              onChange={(e) => {
                setVcardData({ ...vcardData, lastName: e.target.value });
                setErrors((prev) => ({ ...prev, vcardFirstName: undefined }));
              }}
              placeholder="Doe"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Organization</label>
            <input
              type="text"
              value={vcardData.organization}
              onChange={(e) =>
                setVcardData({ ...vcardData, organization: e.target.value })
              }
              placeholder="Company Name"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={vcardData.title}
              onChange={(e) =>
                setVcardData({ ...vcardData, title: e.target.value })
              }
              placeholder="CEO"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone</label>
            <input
              type="tel"
              value={vcardData.phone}
              onChange={(e) => {
                setVcardData({ ...vcardData, phone: e.target.value });
                setErrors((prev) => ({ ...prev, vcardPhone: undefined }));
              }}
              onBlur={() => {
                if (vcardData.phone) {
                  const error = validatePhone(vcardData.phone);
                  setErrors((prev) => ({ ...prev, vcardPhone: error }));
                }
              }}
              placeholder="+1234567890"
              className={`${styles.input} ${errors.vcardPhone ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.vcardPhone} />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={vcardData.email}
              onChange={(e) => {
                setVcardData({ ...vcardData, email: e.target.value });
                setErrors((prev) => ({ ...prev, vcardEmail: undefined }));
              }}
              onBlur={() => {
                if (vcardData.email) {
                  const error = validateEmail(vcardData.email);
                  setErrors((prev) => ({ ...prev, vcardEmail: error }));
                }
              }}
              placeholder="email@example.com"
              className={`${styles.input} ${errors.vcardEmail ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.vcardEmail} />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label>Address</label>
            <input
              type="text"
              value={vcardData.address}
              onChange={(e) =>
                setVcardData({ ...vcardData, address: e.target.value })
              }
              placeholder="123 Main St, City, Country"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
            <label>Website</label>
            <input
              type="url"
              value={vcardData.website}
              onChange={(e) => {
                setVcardData({ ...vcardData, website: e.target.value });
                setErrors((prev) => ({ ...prev, vcardWebsite: undefined }));
              }}
              onBlur={() => {
                if (vcardData.website) {
                  const error = validateURL(vcardData.website);
                  setErrors((prev) => ({ ...prev, vcardWebsite: error }));
                }
              }}
              placeholder="https://example.com"
              className={`${styles.input} ${errors.vcardWebsite ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.vcardWebsite} />
          </div>
        </div>
      )}

      {/* LOCATION INPUT */}
      {dataType === "location" && (
        <>
          <div className={styles.formGroup}>
            <label>Latitude</label>
            <input
              type="text"
              value={locationData.lat}
              onChange={(e) => {
                setLocationData({ ...locationData, lat: e.target.value });
                setErrors((prev) => ({ ...prev, locationLat: undefined }));
              }}
              onBlur={() => {
                const error = validateLatitude(locationData.lat);
                setErrors((prev) => ({ ...prev, locationLat: error }));
              }}
              placeholder="37.7749"
              className={`${styles.input} ${errors.locationLat ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.locationLat} />
          </div>
          <div className={styles.formGroup}>
            <label>Longitude</label>
            <input
              type="text"
              value={locationData.lng}
              onChange={(e) => {
                setLocationData({ ...locationData, lng: e.target.value });
                setErrors((prev) => ({ ...prev, locationLng: undefined }));
              }}
              onBlur={() => {
                const error = validateLongitude(locationData.lng);
                setErrors((prev) => ({ ...prev, locationLng: error }));
              }}
              placeholder="-122.4194"
              className={`${styles.input} ${errors.locationLng ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.locationLng} />
          </div>
        </>
      )}

      {/* EVENT INPUT */}
      {dataType === "event" && (
        <>
          <div className={styles.formGroup}>
            <label>Event Title</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => {
                setEventData({ ...eventData, title: e.target.value });
                setErrors((prev) => ({ ...prev, eventTitle: undefined }));
              }}
              onBlur={() => {
                const error = validateText(eventData.title);
                setErrors((prev) => ({ ...prev, eventTitle: error }));
              }}
              placeholder="Meeting"
              className={`${styles.input} ${errors.eventTitle ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.eventTitle} />
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              placeholder="Conference Room"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Start Date & Time</label>
            <input
              type="datetime-local"
              value={eventData.startDate}
              onChange={(e) => {
                setEventData({ ...eventData, startDate: e.target.value });
                setErrors((prev) => ({ ...prev, eventStartDate: undefined }));
              }}
              onBlur={() => {
                const error = validateDateTime(eventData.startDate, "Start date");
                setErrors((prev) => ({ ...prev, eventStartDate: error }));
              }}
              className={`${styles.input} ${errors.eventStartDate ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.eventStartDate} />
          </div>
          <div className={styles.formGroup}>
            <label>End Date & Time</label>
            <input
              type="datetime-local"
              value={eventData.endDate}
              onChange={(e) => {
                setEventData({ ...eventData, endDate: e.target.value });
                setErrors((prev) => ({ ...prev, eventEndDate: undefined }));
              }}
              onBlur={() => {
                const error = validateDateTime(eventData.endDate, "End date");
                setErrors((prev) => ({ ...prev, eventEndDate: error }));
              }}
              className={`${styles.input} ${errors.eventEndDate ? styles.inputError : ""}`}
            />
            <ErrorMessage message={errors.eventEndDate} />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              placeholder="Event description..."
              rows={3}
              className={styles.textarea}
            />
          </div>
        </>
      )}

      {/* FILE INPUT */}
      {(dataType === "image" ||
        dataType === "pdf" ||
        dataType === "video" ||
        dataType === "file") && (
        <div className={styles.formGroup}>
          <label>
            Upload File (Max {Math.round(QR_LIMITS.DIRECT_UPLOAD.maximum / 1024)}KB for direct encoding)
          </label>

          <div className={styles.uploadOptions}>
            <input
              type="file"
              onChange={handleFileUpload}
              accept={
                dataType === "image"
                  ? "image/*"
                  : dataType === "pdf"
                    ? ".pdf"
                    : dataType === "video"
                      ? "video/*"
                      : "*"
              }
              className={styles.fileInput}
            />

            <button
              type="button"
              onClick={() => setShowCloudHelper(true)}
              className={styles.cloudHelpBtn}
            >
              ☁️ Large File? Use Cloud Storage
            </button>
          </div>

          {fileName && (
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>📎 {fileName}</p>
              {fileData && (
                <p className={styles.fileSize}>
                  Size: {Math.round(new Blob([fileData]).size / 1024)}KB
                </p>
              )}
            </div>
          )}

          <ErrorMessage message={errors.text} />

          <div className={styles.limitInfo}>
            <p>
              <strong>File Size Guidelines:</strong>
            </p>
            <ul>
              <li>✅ Up to 150KB: Recommended (good scanning)</li>
              <li>⚠️ 150KB - 512KB: Possible but complex</li>
              <li>☁️ Over 512KB: Use cloud storage</li>
              <li>🖼️ Images: Auto-compression available</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

