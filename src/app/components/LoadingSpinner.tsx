import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}