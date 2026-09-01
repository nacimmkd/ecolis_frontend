import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/features/booking/services/booking.service.ts";

type CompleteBookingInput = {
    id: string;
    code: string;
};

export default function useCompleteBooking(tripId?: string) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, code }: CompleteBookingInput) => bookingService.completeBooking(id, code),
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId, "bookings"] });
            void queryClient.invalidateQueries({ queryKey: ["booking", id] });
            void queryClient.invalidateQueries({ queryKey: ["parcel"] });
        },
    });

    function completeBooking(id: string, code: string): Promise<boolean> {
        return mutation.mutateAsync({ id, code }).then(() => true).catch(() => false);
    }

    return { completeBooking, isLoading: mutation.isPending };
}
