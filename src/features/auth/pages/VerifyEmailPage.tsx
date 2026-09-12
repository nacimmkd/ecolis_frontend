import VerifyEmailForm from "@/features/auth/components/VerifyEmailForm/VerifyEmailForm.tsx";
import { useEffect, useState } from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import useVerifyEmail from "@/features/auth/hooks/useVerifyEmail.ts";
import { paths } from "@/app/routes/paths.ts";
import Container from "@/shared/components/container/Container.tsx";

export default function VerifyEmailPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();
    const email = location.state?.email ?? "";
    const token = searchParams.get("token");

    const { requestEmailVerification, verifyEmail, isLoading, error } = useVerifyEmail();
    const [sent, setSent] = useState(false);

    async function sendVerification() {
        if (await requestEmailVerification({ email })) {
            setSent(true);
        }
    }

    useEffect(() => {
        if (!token) return;

        verifyEmail({ token }).then((success) => {
            if (!success) return;
            navigate(paths.login, {
                replace: true,
                state: { notice: "Email vérifié ! Vous pouvez vous connecter." },
            });
        });
    }, [navigate, token, verifyEmail]);

    return (
        <Container align="center" flex="1" padding={20} maxWidth={1200} margin="0 auto">
            <VerifyEmailForm
                email={email}
                sent={sent}
                isLoading={isLoading}
                error={error}
                onSend={sendVerification}
            />
        </Container>
    );
}