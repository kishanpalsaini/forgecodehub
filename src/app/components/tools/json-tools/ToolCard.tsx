import Link from "next/link";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  href: string;
  icon: string;
  tag?: string;
  tagClass?: string;
  name: string;
  desc: string;
}

export default function ToolCard({ href, icon, tag, tagClass, name, desc }: ToolCardProps) {
  return (
    <Link href={href} className={styles.toolCard}>
      <div className={styles.cardIcon}>{icon}</div>
      {tag && <span className={`${styles.tag} ${styles[tagClass || ""]}`}>{tag}</span>}
      <h3 className={styles.cardTitle}>{name}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </Link>
  );
}