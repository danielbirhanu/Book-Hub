import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
  label: string;
}

export function Field({ error, hint, id, label, ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  const descriptionId = fieldId ? `${fieldId}-description` : undefined;

  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <input
        aria-describedby={hint || error ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        id={fieldId}
        {...props}
      />
      {error ? (
        <p className="field-error" id={descriptionId}>
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint" id={descriptionId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
