import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/features/booking/services/booking.service.ts";

type RejectBookingInput = {
    id: string;
    reason: string;
};

export default function useRejectBooking(tripId?: string) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, reason }: RejectBookingInput) => bookingService.rejectBooking(id, reason),
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId, "requests"] });
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId, "bookings"] });
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
            void queryClient.invalidateQueries({ queryKey: ["booking", id] });
            void queryClient.invalidateQueries({ queryKey: ["parcel"] });
        },
    });

    function rejectBooking(id: string, reason: string): Promise<boolean> {
        return mutation.mutateAsync({ id, reason }).then(() => true).catch(() => false);
    }

    return { rejectBooking, isLoading: mutation.isPending };
}
