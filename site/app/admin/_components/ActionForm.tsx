"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "@/lib/types";
import styles from "../admin.module.css";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children?: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  confirmText?: string;
  className?: string;
  variant?: "solid" | "plain";
  compact?: boolean;
};

export function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Saving…",
  confirmText,
  className,
  variant = "plain",
  compact = false,
}: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
      <div className={styles.formFooter}>
        <button
          type="submit"
          className={`btn btn--small${variant === "solid" ? " btn--solid" : ""}`}
          disabled={pending}
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        <p
          role="status"
          className={`${styles.status} ${state && !state.ok ? styles.error : ""} ${compact ? "visually-hidden" : ""}`}
        >
          {state?.message}
        </p>
      </div>
    </form>
  );
}
