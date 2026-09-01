import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/features/booking/services/booking.service.ts";
import type { AppError } from "@/shared/types/AppError";

export default function useCancelBooking() {

    const queryClient = useQueryClient();

    const mutation = useMutation<void, AppError, string>({
        mutationFn: (id: string) => bookingService.cancelBooking(id),
        onSuccess: (_data, id) => {
            void queryClient.invalidateQueries({ queryKey: ["booking", id] });
            void queryClient.invalidateQueries({ queryKey: ["parcel"] });
        },
    });

    function cancelBooking(id: string): Promise<boolean> {
        return mutation.mutateAsync(id).then(() => true).catch(() => false);
    }

    return { cancelBooking, isLoading: mutation.isPending, error: mutation.error };
}
