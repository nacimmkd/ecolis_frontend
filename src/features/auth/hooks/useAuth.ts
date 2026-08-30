import { useMutation } from "@tanstack/react-query";
import type { AuthRequest, UserDetails } from "@/shared/types";
import authService from "@/features/auth/services/auth.service";
import type { AppError } from "@/shared/types/AppError";
import authStore from "@/features/auth/store/auth.store.ts";

export default function useAuth() {

    const setUser = authStore((s) => s.setUser);
    const isAuthenticated = authStore((s) => s.isAuthenticated);

    const loginMutation = useMutation<UserDetails, AppError, AuthRequest>({
        mutationFn: (credentials) => authService.login(credentials),
        onSuccess: setUser,
    });

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSettled: () => setUser(null),
    });

    function login(credentials: AuthRequest): Promise<AppError | null> {
        return loginMutation.mutateAsync(credentials).then(() => null).catch((err: AppError) => err);
    }

    function logout(): Promise<void> {
        return logoutMutation.mutateAsync().catch(() => {});
    }

    function loginWithGoogle(): void {
        window.location.href = authService.getGoogleAuthUrl();
    }

    return {
        login,
        logout,
        loginWithGoogle,
        isAuthenticated,
        isLoading: loginMutation.isPending || logoutMutation.isPending,
        error: loginMutation.error,
    };
}
