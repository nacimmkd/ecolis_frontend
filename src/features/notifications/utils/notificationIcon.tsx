import {
    Ban,
    CalendarPlus,
    CircleCheckBig,
    CreditCard,
    Inbox,
    MessageCircle,
    PackageCheck,
    PartyPopper,
    Star,
} from "lucide-react";
import type { NotificationDto } from "@/shared/types";

type NotificationType = NonNullable<NotificationDto["type"]>;

const NOTIFICATION_ICON: Partial<Record<NotificationType, React.ReactNode>> = {
    USER_CREATED: <PartyPopper size={18} />,
    MESSAGE_RECEIVED: <MessageCircle size={18} />,
    REQUEST_RECEIVED: <Inbox size={18} />,
    BOOKING_CREATED: <CalendarPlus size={18} />,
    BOOKING_CANCELED: <Ban size={18} />,
    BOOKING_COMPLETED: <CircleCheckBig size={18} />,
    BOOKING_PAID: <CreditCard size={18} />,
    TRIP_CANCELLED: <Ban size={18} />,
    PARCEL_DELIVERED: <PackageCheck size={18} />,
    REVIEW_CREATED: <Star size={18} />,
};

export default function notificationIcon(notification: NotificationDto): React.ReactNode {
    if (!notification.type) return <Inbox size={18} />;
    return NOTIFICATION_ICON[notification.type] ?? <Inbox size={18} />;
}
