import styles from "../qr-barcode-generator.module.css";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className={styles.errorMessage}>
      <span className={styles.errorIcon}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}