import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PackageCheck, Route, Ruler, WeightTilde } from "lucide-react";
import styles from "./BookingDetailsPage.module.css";
import Text from "@/shared/components/text/Text.tsx";
import Tag from "@/shared/components/tag/Tag.tsx";
import Container from "@/shared/components/container/Container.tsx";
import Spinner from "@/shared/components/spinner/Spinner.tsx";
import Price from "@/shared/components/price/Price.tsx";
import Button from "@/shared/components/button/Button.tsx";
import Confirmation from "@/shared/components/confirmation/Confirmation.tsx";
import Error from "@/shared/components/error/Error.tsx";
import Itinerary from "@/shared/components/itinerary/Itinerary.tsx";
import UserBrief from "@/features/profile/components/UserBrief/UserBrief.tsx";
import authStore from "@/features/auth/store/auth.store.ts";
import useBookingQuery from "@/features/booking/hooks/useBookingQuery.ts";
import useCancelBooking from "@/features/booking/hooks/useCancelBooking.ts";
import bookingStateLabel from "@/shared/utils/bookingStateLabel.ts";
import { bookingPaymentPath, userProfilePath } from "@/app/routes/paths.ts";
import type { BookingDto } from "@/shared/types";

const PAYMENT_STATUS_TEXT: Record<NonNullable<BookingDto["state"]>, string> = {
    PENDING: "En attente de paiement",
    WAITING_FOR_ANSWER: "Votre demande est bien envoyée au livreur",
    ACCEPTED: "Votre demande a été acceptée",
    REJECTED: "Réservation refusée",
    CANCELLED: "Réservation annulée",
    COMPLETED: "Livraison terminée",
};

function paymentStatusText(state: BookingDto["state"]): string {
    return PAYMENT_STATUS_TEXT[state ?? "PENDING"];
}

export default function BookingDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { booking, isLoading, isError } = useBookingQuery(id);
    const { cancelBooking, isLoading: isCancelling, error: cancelError } = useCancelBooking();
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const currentUserId = authStore((s) => s.user?.userId);

    if (isError) {
        return (
            <Container gap={30} maxWidth={1000} margin="0 auto" padding={20}>
                <Text tag="p" align="center">Réservation introuvable.</Text>
            </Container>
        );
    }

    if (!booking || isLoading) {
        return (
            <Container direction="row" align="center" justify="center" minHeight="40vh">
                <Spinner />
            </Container>
        );
    }

    const canPay = booking.state === "PENDING";
    const canCancel = booking.state === "PENDING" || booking.state === "WAITING_FOR_ANSWER" || booking.state === "ACCEPTED";
    const otherParty = currentUserId === booking.sender?.userId ? booking.carrier : booking.sender;

    async function handleCancel() {
        const success = await cancelBooking(booking?.bookingId ?? "");
        if (success) setIsCancelOpen(false);
    }

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.iconBadge}>
                            <PackageCheck size={26} />
                        </div>
                        <Text tag="h2" weight="bold">Réservation</Text>
                        <Text tag="p" muted>{paymentStatusText(booking.state)}</Text>
                        <Tag icon={<Route size={14} />} value={bookingStateLabel(booking.state)} />
                    </div>

                    <div className={styles.section}>
                        <Text tag="h4" weight="semibold" muted size={0.8}>Colis</Text>
                        <Text tag="p" weight="semibold">{booking.parcel?.title}</Text>
                        <Container direction="row" wrap align="center" gap={8}>
                            <Tag icon={<WeightTilde />} value={`${booking.parcel?.weightKg} kg`} />
                            <Tag icon={<Ruler />} value={booking.parcel?.size ?? ""} />
                            {booking.parcel?.fragile && (
                                <Tag icon={<Ruler />} value="Fragile" variant="accent" />
                            )}
                        </Container>
                    </div>

                    <div className={styles.section}>
                        <Text tag="h4" weight="semibold" muted size={0.8}>Trajet</Text>
                        <Itinerary
                            departure={booking.trip?.departure}
                            arrival={booking.trip?.arrival}
                            departureDate={booking.trip?.departureDate}
                            arrivalDate={booking.trip?.arrivalDate}
                        />
                    </div>

                    {canCancel && (
                        <Button
                            label="Annuler la réservation"
                            variant="ghost"
                            fullWidth
                            onClick={() => setIsCancelOpen(true)}
                        />
                    )}
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.paymentCard}>
                        <Text tag="h4" weight="semibold" muted size={0.8}>Paiement</Text>
                        <Price totalPrice={booking.price} label="Prix total" />
                        {canPay && ( <Button to={bookingPaymentPath(booking.bookingId ?? "")} label="Payer" variant="main" fullWidth />)}
                    </div>

                    <div className={styles.carrierCard}>
                        {otherParty && (
                            <Link to={userProfilePath(otherParty.userId ?? "")} className={styles.carrierLink}>
                                <UserBrief user={otherParty} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {isCancelOpen && (
                <Confirmation
                    type="delete"
                    title="Annuler cette réservation ?"
                    description={
                        <>
                            Cette action est irréversible.
                            <Error error={cancelError} />
                        </>
                    }
                    confirmLabel="Annuler la réservation"
                    cancelLabel="Retour"
                    onConfirm={handleCancel}
                    onClose={() => setIsCancelOpen(false)}
                    isLoading={isCancelling}
                />
            )}
        </div>
    );
}
