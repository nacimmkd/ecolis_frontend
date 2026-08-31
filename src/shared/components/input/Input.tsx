import styles from "./Input.module.css"
import * as React from "react";

type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date";

type BaseInputProps = {
    id?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    label?: string;
    hint?: React.ReactNode;
    autoComplete?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
};

type SingleLineInputProps = BaseInputProps & {
    multiline?: false;
    type?: InputType;
    suffix?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

type MultilineInputProps = BaseInputProps & {
    multiline: true;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

type InputProps = SingleLineInputProps | MultilineInputProps;

export default function Input(props: InputProps) {
    const {
        id,
        name,
        value,
        placeholder,
        label,
        hint,
        autoComplete,
        required,
        disabled,
        error,
        className = "",
    } = props;

    return (
        <div className={`${styles.field} ${className}`}>

            {(label || hint) && (
                <div className={styles.labelRow}>
                    {label && (
                        <label className={styles.label} htmlFor={id}>
                            {label}
                        </label>
                    )}
                    {hint && <span className={styles.hint}>{hint}</span>}
                </div>
            )}

            <div className={styles.inputWrapper}>
                {props.multiline === true ? (
                    <textarea
                        className={`${styles.input} ${styles.textarea} ${error ? styles.inputError : ""}`}
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        rows={props.rows ?? 4}
                        onChange={props.onChange}
                        onFocus={props.onFocus}
                        onKeyDown={props.onKeyDown}
                    />
                ) : (
                    <input
                        className={`${styles.input} ${props.suffix ? styles.inputWithSuffix : ""} ${error ? styles.inputError : ""}`}
                        id={id}
                        name={name}
                        type={props.type ?? "text"}
                        value={value}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        required={required}
                        disabled={disabled}
                        onChange={props.onChange}
                        onFocus={props.onFocus}
                        onKeyDown={props.onKeyDown}
                    />
                )}
                {props.multiline !== true && props.suffix && <span className={styles.suffix}>{props.suffix}</span>}
            </div>

            {error && <span className={styles.error}>{error}</span>}

        </div>
    );
}
