import { useMutation } from "@tanstack/react-query";
import userService from "@/features/auth/services/user.service";
import type { UserCreateRequest, UserDetails } from "@/shared/types";
import type { AppError } from "@/shared/types/AppError";

type RegisterResult = {
    user: UserDetails | null;
    error: AppError | null;
};

export default function useRegister() {

    const mutation = useMutation<UserDetails, AppError, UserCreateRequest>({
        mutationFn: (data) => userService.register(data),
    });

    function register(data: UserCreateRequest): Promise<RegisterResult> {
        return mutation.mutateAsync(data)
            .then((user) => ({ user, error: null }))
            .catch((error: AppError) => ({ user: null, error }));
    }

    return {
        register,
        isLoading: mutation.isPending,
        error: mutation.error,
    };
}
