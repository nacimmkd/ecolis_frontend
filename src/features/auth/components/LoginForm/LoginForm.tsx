import { Link } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { paths } from "@/app/routes/paths";
import Button from "@/shared/components/button/Button";
import Icon from "@/shared/components/icon/Icon";
import Input from "@/shared/components/input/Input";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import Text from "@/shared/components/text/Text";
import Error from "@/shared/components/error/Error.tsx";
import type { AuthRequest } from "@/shared/types";
import type { AppError } from "@/shared/types/AppError";
import Divider from "@/shared/components/divider/Divider";
import Container from "@/shared/components/container/Container.tsx";
import { useState } from "react";

type LoginFormProps = {
    form: AuthRequest;
    isLoading: boolean;
    error: AppError | null;
    notice: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleClick: () => void;
};

export default function LoginForm({
                                      form,
                                      isLoading,
                                      error,
                                      notice,
                                      onChange,
                                      onSubmit,
                                      onGoogleClick,
                                  }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const hasGenericError = !!error && !error.hasFieldErrors;

    return (
        <Container variant="elevated" maxWidth={420} gap={22} className={styles.container}>
            <Error error={error} />
            {!hasGenericError && notice && (
                <Text className={styles.message} align="center" animate="slideUp">
                    {notice}
                </Text>
            )}

            <Container gap={0} className={styles.heading}>
                <Text tag="h1" weight="bold" size={2} className={styles.title}>Bon retour</Text>
                <Text tag="p" className={styles.subtitle}>Connectez-vous à votre compte Ecolis</Text>
            </Container>

            <form className={styles.form} onSubmit={onSubmit}>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="E-mail"
                    value={form.email}
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    required
                    onChange={onChange}
                    error={error?.fields.email}
                />

                <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Mot de passe"
                    value={form.password}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    onChange={onChange}
                    error={error?.fields.password}
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
                    hint={
                        <Link className={styles.forgot} to={paths.reset_password}>Mot de passe oublié ?</Link>
                    }
                />

                <Button
                    label="Se connecter"
                    type="submit"
                    variant="main"
                    fullWidth
                    icon={<ArrowUpRight size={20} />}
                    iconPosition="right"
                    loading={isLoading}
                />
            </form>

            <Divider text="OU CONTINUER AVEC" />

            <Button
                label="Google"
                variant="secondary"
                fullWidth
                onClick={onGoogleClick}
                icon={<Icon src="/google_logo.png" size={18} />}
                iconPosition="left"
            />

            <p className={styles.footer}>
                Nouveau sur Ecolis ? <Link className={styles.link} to={paths.signup}>Créer un compte</Link>
            </p>
        </Container>
    );
}