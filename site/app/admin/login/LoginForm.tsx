"use client";

import { useActionState } from "react";
import { login } from "../actions";
import styles from "../admin.module.css";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className={styles.stack}>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="btn btn--solid" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p role="status" className={`${styles.status} ${styles.error}`}>
        {state?.message}
      </p>
    </form>
  );
}
