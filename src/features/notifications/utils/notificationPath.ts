import {bookingDetailsPath, parcelDetailsPath, paths, tripDetailsPath, tripRequestsPath, userReviewsPath} from "@/app/routes/paths.ts";
import authStore from "@/features/auth/store/auth.store.ts";
import type { NotificationDto } from "@/shared/types";

export default function notificationPath(notification: NotificationDto): string | undefined {
    if (notification.type === "USER_CREATED") return paths.profile;

    if (!notification.referenceId) return undefined;

    switch (notification.type) {
        case "BOOKING_CREATED":
        case "BOOKING_CANCELED":
        case "BOOKING_COMPLETED":
        case "BOOKING_PAID":
            return bookingDetailsPath(notification.referenceId);
        case "TRIP_CANCELLED":
            return tripDetailsPath(notification.referenceId);
        case "PARCEL_DELIVERED":
            return parcelDetailsPath(notification.referenceId);
        case "REQUEST_RECEIVED":
            return tripRequestsPath(notification.referenceId);
        case "REVIEW_CREATED": {
            const userId = authStore.getState().user?.userId;
            return userId ? userReviewsPath(userId) : paths.profile;
        }
        default:
            return undefined;
    }
}
