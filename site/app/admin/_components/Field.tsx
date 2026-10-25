import styles from "../admin.module.css";

type Props = {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  maxLength?: number;
  idPrefix?: string;
};

export function Field({ label, name, defaultValue, type = "text", required, multiline, rows = 4, hint, maxLength, idPrefix = "" }: Props) {
  const id = `${idPrefix}${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} name={name} rows={rows} defaultValue={defaultValue ?? ""} required={required} maxLength={maxLength} aria-describedby={hintId} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} maxLength={maxLength} aria-describedby={hintId} />
      )}
      {hint ? <p id={hintId} className={styles.hint}>{hint}</p> : null}
    </div>
  );
}
