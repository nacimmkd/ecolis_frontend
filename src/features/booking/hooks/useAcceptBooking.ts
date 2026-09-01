import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/features/booking/services/booking.service.ts";

export default function useAcceptBooking(tripId?: string) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => bookingService.acceptBooking(id),
        onSuccess: (_data, id) => {
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId, "requests"] });
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId, "bookings"] });
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
            void queryClient.invalidateQueries({ queryKey: ["booking", id] });
            void queryClient.invalidateQueries({ queryKey: ["parcel"] });
        },
    });

    function acceptBooking(id: string): Promise<boolean> {
        return mutation.mutateAsync(id).then(() => true).catch(() => false);
    }

    return { acceptBooking, isLoading: mutation.isPending };
}
