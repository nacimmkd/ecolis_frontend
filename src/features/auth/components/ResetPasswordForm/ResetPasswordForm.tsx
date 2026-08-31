import { useState } from "react";
import styles from "./ResetPasswordForm.module.css";
import { ArrowUpRight, Eye, EyeOff, Mail } from "lucide-react";
import Button from "@/shared/components/button/Button";
import Input from "@/shared/components/input/Input";
import Text from "@/shared/components/text/Text";
import Error from "@/shared/components/error/Error.tsx";
import Container from "@/shared/components/container/Container.tsx";
import type { AppError } from "@/shared/types/AppError";

type ResetPasswordFormProps = {
    token: string | null;

    email: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRequestSubmit: (e: React.FormEvent) => void;
    requestSent: boolean;

    newPassword: string;
    onPasswordChange: (value: string) => void;
    onResetSubmit: (e: React.FormEvent) => void;

    isLoading: boolean;
    error: AppError | null;
};

export default function ResetPasswordForm({
    token,
    email,
    onEmailChange,
    onRequestSubmit,
    requestSent,
    newPassword,
    onPasswordChange,
    onResetSubmit,
    isLoading,
    error,
}: ResetPasswordFormProps) {

    const [showPassword, setShowPassword] = useState(false);

    if (!token) {

        if (requestSent) {
            return (
                <Container variant="elevated" maxWidth={420} gap={22} className={styles.container}>
                    <Container gap={0} className={styles.heading}>
                        <Text tag="h1" weight="bold" size={2}>Vérifiez votre boîte mail</Text>
                        <Text tag="p" muted>
                            Si un compte existe pour {email}, un lien de réinitialisation vient d'être envoyé.
                        </Text>
                    </Container>
                </Container>
            );
        }

        return (
            <Container variant="elevated" maxWidth={420} gap={22} className={styles.container}>

                <Container gap={0} className={styles.heading}>
                    <Text tag="h1" weight="bold" size={2}>Mot de passe oublié</Text>
                    <Text tag="p" muted>Entrez votre email pour recevoir un lien de réinitialisation</Text>
                </Container>

                <form className={styles.form} onSubmit={onRequestSubmit}>

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="E-mail"
                        value={email}
                        placeholder="vous@exemple.com"
                        autoComplete="email"
                        required
                        onChange={onEmailChange}
                        error={error?.fields.email}
                    />

                    <Error error={error} />

                    <Button
                        label="Envoyer le lien"
                        type="submit"
                        variant="main"
                        fullWidth
                        icon={<Mail size={20} />}
                        iconPosition="left"
                        loading={isLoading}
                    />

                </form>

            </Container>
        );
    }

    /* ---- Token présent : saisie du nouveau mot de passe ----------------------------- */

    return (
        <Container variant="elevated" maxWidth={420} gap={22} className={styles.container}>

            <Error error={error} />

            <Container gap={0} className={styles.heading}>
                <Text tag="h1" weight="bold" size={2}>Nouveau mot de passe</Text>
                <Text tag="p" muted>Choisissez un nouveau mot de passe pour votre compte</Text>
            </Container>

            <form className={styles.form} onSubmit={onResetSubmit}>

                <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    label="Nouveau mot de passe"
                    value={newPassword}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    onChange={(e) => onPasswordChange(e.target.value)}
                    error={error?.fields.newPassword}
                    hint={<Text tag="small" muted>Au moins 8 caractères</Text>}
                    suffix={
                        showPassword ? (
                            <EyeOff
                                size={18}
                                className={styles.toggle}
                                onClick={() => setShowPassword((v) => !v)}
                            />
                        ) : (
                            <Eye
                                size={18}
                                className={styles.toggle}
                                onClick={() => setShowPassword((v) => !v)}
                            />
                        )
                    }
                />

                <Button
                    label="Réinitialiser"
                    type="submit"
                    variant="main"
                    fullWidth
                    icon={<ArrowUpRight size={20} />}
                    iconPosition="right"
                    loading={isLoading}
                />

            </form>

        </Container>
    );
}