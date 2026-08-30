import api from "@/app/config/axios.config";
import type { BookingDto, CreateBookingRequest } from "@/shared/types";

const bookingService = {

    async createBooking(data: CreateBookingRequest): Promise<BookingDto> {
        const res = await api.post<BookingDto>("/api/v1/bookings", data);
        return res.data;
    },

    async getBooking(id: string): Promise<BookingDto> {
        const res = await api.get<BookingDto>(`/api/v1/bookings/${id}`);
        return res.data;
    },

    async cancelBooking(id: string): Promise<void> {
        await api.patch(`/api/v1/bookings/${id}/cancel`);
    },

    async acceptBooking(id: string): Promise<void> {
        await api.patch(`/api/v1/bookings/${id}/accept`);
    },

    async rejectBooking(id: string, reason: string): Promise<void> {
        await api.patch(`/api/v1/bookings/${id}/reject`, null, { params: { reason } });
    },

    async confirmPickup(id: string, code: string): Promise<void> {
        await api.patch(`/api/v1/bookings/${id}/confirm-pickup`, null, { params: { code } });
    },

    async completeBooking(id: string, code: string): Promise<void> {
        await api.patch(`/api/v1/bookings/${id}/complete`, null, { params: { code } });
    },

};

export default bookingService;
