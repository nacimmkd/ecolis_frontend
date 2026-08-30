import api from "@/app/config/axios.config";
import type {AddressRequest, PageTripBookingDto, PageTripSummary, TripCreateRequest, TripDetails, TripUpdateRequest} from "@/shared/types";

const tripService = {

    async getTrip(id: string): Promise<TripDetails> {
        const res = await api.get<TripDetails>(`/api/v1/trips/${id}`);
        return res.data;
    },

    async getMyTrips(page = 0, size = 20): Promise<PageTripSummary> {
        const res = await api.get<PageTripSummary>("/api/v1/trips/me", { params: { page, size } });
        return res.data;
    },

    async createTrip(data: TripCreateRequest): Promise<TripDetails> {
        const res = await api.post<TripDetails>("/api/v1/trips", data);
        return res.data;
    },

    async updateTrip(id: string, data: TripUpdateRequest): Promise<TripDetails> {
        const res = await api.put<TripDetails>(`/api/v1/trips/${id}`, data);
        return res.data;
    },

    async deleteTrip(id: string): Promise<void> {
        await api.delete(`/api/v1/trips/${id}`);
    },

    async addStop(id: string, data: AddressRequest): Promise<void> {
        await api.post(`/api/v1/trips/${id}/stops`, data);
    },

    async deleteStop(tripId: string, stopId: string): Promise<void> {
        await api.delete(`/api/v1/trips/${tripId}/stops/${stopId}`);
    },

    async getTripBookings(tripId: string, page = 0, size = 20): Promise<PageTripBookingDto> {
        const res = await api.get<PageTripBookingDto>(`/api/v1/trips/${tripId}/bookings`, { params: { page, size } });
        return res.data;
    },

    async getTripRequests(tripId: string, page = 0, size = 20): Promise<PageTripBookingDto> {
        const res = await api.get<PageTripBookingDto>(`/api/v1/trips/${tripId}/requests`, { params: { page, size } });
        return res.data;
    },

};

export default tripService;
