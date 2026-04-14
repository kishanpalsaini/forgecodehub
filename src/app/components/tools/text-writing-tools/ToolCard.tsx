import styles from './ToolCard.module.css';
import { ToolCardProps } from './types';

export default function ToolCard({ tool, isActive, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      aria-label={`Switch to ${tool.name}`}
      type="button"
    >
      <div className={styles.icon}>{tool.icon}</div>
      <div className={styles.name}>{tool.name}</div>
    </button>
  );
}