import { CLOUD_STORAGE_OPTIONS } from "../utils/constants";
import styles from "../qr-barcode-generator.module.css";

interface CloudStorageHelperProps {
  onClose: () => void;
}

export default function CloudStorageHelper({ onClose }: CloudStorageHelperProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>☁️ Upload Large Files to Cloud Storage</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalIntro}>
            <strong>QR codes can only hold ~3KB of data.</strong> For files
            larger than 150KB, upload to cloud storage and encode the share link
            instead.
          </p>

          <div className={styles.cloudOptions}>
            {CLOUD_STORAGE_OPTIONS.map((option, idx) => (
              <div key={idx} className={styles.cloudOption}>
                <div className={styles.cloudHeader}>
                  <span className={styles.cloudIcon}>{option.icon}</span>
                  <div>
                    <h3>{option.name}</h3>
                    <span className={styles.cloudSize}>
                      Max: {option.maxSize}
                    </span>
                  </div>
                  <a
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cloudLink}
                  >
                    Open →
                  </a>
                </div>
                <ol className={styles.cloudSteps}>
                  {option.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className={styles.proTip}>
            <h4>💡 Pro Tips:</h4>
            <ul>
              <li>
                Use URL shorteners (bit.ly, tinyurl.com) to make QR codes
                simpler
              </li>
              <li>Set link expiration if sharing sensitive files</li>
              <li>Test the QR code after generating to ensure it works</li>
              <li>Print QR codes at least 2cm x 2cm for reliable scanning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}