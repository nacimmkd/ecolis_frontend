import type { NotificationDto } from "@/shared/types";

type NotificationType = NonNullable<NotificationDto["type"]>;

const NOTIFICATION_TEXT: Partial<Record<NotificationType, string>> = {
    USER_CREATED: "Complétez votre profil",
    MESSAGE_RECEIVED: "Vous avez reçu un nouveau message.",
    REQUEST_RECEIVED: "Nouvelle demande de réservation reçue.",
    BOOKING_CREATED: "Votre réservation a été créée.",
    BOOKING_CANCELED: "Une réservation a été annulée.",
    BOOKING_COMPLETED: "Une livraison a été terminée.",
    BOOKING_PAID: "Votre paiement a été confirmé.",
    TRIP_CANCELLED: "Un trajet a été annulé.",
    PARCEL_DELIVERED: "Votre colis a été livré.",
    REVIEW_CREATED: "Vous avez reçu un nouvel avis.",
};

export default function notificationText(notification: NotificationDto): string {
    if (!notification.type) return "Nouvelle notification.";
    return NOTIFICATION_TEXT[notification.type] ?? "Nouvelle notification.";
}
