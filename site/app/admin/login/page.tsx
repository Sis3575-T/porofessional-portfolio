import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import styles from "../admin.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className={`container ${styles.login}`}>
      <h1 className={styles.loginTitle}>Sign in</h1>
      <LoginForm />
    </main>
  );
}
