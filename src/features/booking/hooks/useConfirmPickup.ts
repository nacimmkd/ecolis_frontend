import { useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/features/booking/services/booking.service.ts";

type ConfirmPickupInput = {
    id: string;
    code: string;
};

export default function useConfirmPickup(tripId?: string) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, code }: ConfirmPickupInput) => bookingService.confirmPickup(id, code),
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({ queryKey: ["trip", tripId, "bookings"] });
            void queryClient.invalidateQueries({ queryKey: ["booking", id] });
            void queryClient.invalidateQueries({ queryKey: ["parcel"] });
        },
    });

    function confirmPickup(id: string, code: string): Promise<boolean> {
        return mutation.mutateAsync({ id, code }).then(() => true).catch(() => false);
    }

    return { confirmPickup, isLoading: mutation.isPending };
}
