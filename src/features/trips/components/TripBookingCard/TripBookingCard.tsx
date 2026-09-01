import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, CheckCheck, MapPin, PackageCheck, Star, WeightTilde, X } from "lucide-react";
import styles from "./TripBookingCard.module.css";
import Text from "@/shared/components/text/Text.tsx";
import Container from "@/shared/components/container/Container.tsx";
import Divider from "@/shared/components/divider/Divider.tsx";
import Price from "@/shared/components/price/Price.tsx";
import Button from "@/shared/components/button/Button.tsx";
import Tag from "@/shared/components/tag/Tag.tsx";
import Itinerary from "@/shared/components/itinerary/Itinerary.tsx";
import UserBrief from "@/features/profile/components/UserBrief/UserBrief.tsx";
import CreateReviewPopup from "@/features/reviews/components/CreateReviewPopup/CreateReviewPopup.tsx";
import bookingStateLabel from "@/shared/utils/bookingStateLabel.ts";
import googleMapsUrl from "@/shared/utils/googleMapsUrl.ts";
import { bookingDetailsPath, userProfilePath } from "@/app/routes/paths.ts";
import type { TripBookingDto } from "@/shared/types";

type TripBookingCardProps = {
    booking: TripBookingDto;
    onAccept?: () => void;
    onReject?: () => void;
    isAccepting?: boolean;
    isRejecting?: boolean;
    onConfirmPickup?: () => void;
    isConfirmingPickup?: boolean;
    onCompleteDelivery?: () => void;
    isCompletingDelivery?: boolean;
};

export default function TripBookingCard({
    booking,
    onAccept,
    onReject,
    isAccepting = false,
    isRejecting = false,
    onConfirmPickup,
    isConfirmingPickup = false,
    onCompleteDelivery,
    isCompletingDelivery = false,
}: TripBookingCardProps) {
    const navigate = useNavigate();
    const [showReview, setShowReview] = useState(false);
    const canRespond = Boolean(onAccept || onReject);
    const canManage = Boolean(onConfirmPickup || onCompleteDelivery);
    const canReview = booking.state === "COMPLETED";
    const isPickedUp = booking.parcel?.state != null && booking.parcel.state !== "BOOKED";
    const mapsUrl = googleMapsUrl(isPickedUp ? booking.parcel?.dropoff : booking.parcel?.pickup);

    function handleClick() {
        if (!booking.bookingId) return;
        navigate(bookingDetailsPath(booking.bookingId));
    }

    return (
        <div className={`${styles.container} ${styles.clickable}`} onClick={handleClick}>
            {!canRespond && <Tag className={styles.tag} value={bookingStateLabel(booking.state)} />}

            <div className={styles.left_container}>
                <Container direction="row" align="center" gap={8} className={styles.parcel_header}>
                    <Text tag="p" weight="semibold" className={styles.parcel_title}>{booking.parcel?.title}</Text>
                    <Tag icon={<WeightTilde size={14} />} value={`${booking.parcel?.weightKg ?? 0} kg`} />
                </Container>

                <Itinerary
                    departure={booking.parcel?.pickup}
                    arrival={booking.parcel?.dropoff}
                />
            </div>

            <Divider orientation="vertical" className={styles.divider} />

            <Link
                to={userProfilePath(booking.sender?.userId ?? "")}
                className={styles.middle_container}
                onClick={(e) => e.stopPropagation()}
            >
                {booking.sender && <UserBrief user={booking.sender} />}
            </Link>

            <Divider orientation="vertical" className={styles.divider} />

            <div className={styles.right_container}>
                <div className={styles.price_container}>
                    <Price totalPrice={booking.price} label="Prix total" align="right" />
                </div>

                {canRespond && (
                    <div className={`${styles.actions} ${styles.stacked}`} onClick={(e) => e.stopPropagation()}>
                        <Button
                            label="Accepter"
                            variant="main"
                            size="sm"
                            icon={<Check size={16} />}
                            onClick={onAccept}
                            loading={isAccepting}
                            disabled={isRejecting}
                        />
                        <Button
                            label="Refuser"
                            variant="danger"
                            size="sm"
                            icon={<X size={16} />}
                            onClick={onReject}
                            loading={isRejecting}
                            disabled={isAccepting}
                        />
                    </div>
                )}

                {canManage && (
                    <div className={`${styles.actions} ${styles.stacked}`} onClick={(e) => e.stopPropagation()}>
                        <Button
                            label="Localiser"
                            variant="secondary"
                            size="sm"
                            icon={<MapPin size={16} />}
                            onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")}
                            disabled={!mapsUrl}
                        />
                        {!isPickedUp && onConfirmPickup && (
                            <Button
                                label="Récupérer"
                                variant="main"
                                size="sm"
                                icon={<PackageCheck size={16} />}
                                onClick={onConfirmPickup}
                                loading={isConfirmingPickup}
                            />
                        )}

                        {isPickedUp && onCompleteDelivery && (
                            <Button
                                label="Terminer"
                                variant="main"
                                size="sm"
                                icon={<CheckCheck size={16} />}
                                onClick={onCompleteDelivery}
                                loading={isCompletingDelivery}
                            />
                        )}
                    </div>
                )}

                {canReview && (
                    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                        <Button
                            label="Laisser un avis"
                            variant="secondary"
                            size="sm"
                            icon={<Star size={16} />}
                            onClick={() => setShowReview(true)}
                        />

                        {showReview && (
                            <CreateReviewPopup
                                bookingId={booking.bookingId ?? ""}
                                revieweeLabel="cet expéditeur"
                                onClose={() => setShowReview(false)}
                                onSuccess={() => setShowReview(false)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
