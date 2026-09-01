import { useState } from "react";
import { Star } from "lucide-react";
import styles from "./CreateReviewPopup.module.css";
import Popup from "@/shared/components/popup/Popup.tsx";
import Button from "@/shared/components/button/Button.tsx";
import Input from "@/shared/components/input/Input.tsx";
import Text from "@/shared/components/text/Text.tsx";
import Container from "@/shared/components/container/Container.tsx";
import Error from "@/shared/components/error/Error.tsx";
import useCreateReview from "@/features/reviews/hooks/useCreateReview.ts";

type CreateReviewPopupProps = {
    bookingId: string;
    revieweeLabel?: string;
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateReviewPopup({ bookingId, revieweeLabel = "ce livreur", onClose, onSuccess }: CreateReviewPopupProps) {
    const { createReview, isLoading, error } = useCreateReview();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    async function handleSubmit() {
        if (rating === 0) return;
        const success = await createReview({ bookingId, rating, comment: comment.trim() || undefined });
        if (success) onSuccess();
    }

    return (
        <Popup onClose={onClose}>
            <Container gap={12}>
                <Text tag="h3" weight="bold">Laisser un avis</Text>
                <Text tag="p" muted>Partagez votre expérience avec {revieweeLabel}.</Text>

                <Container direction="row" align="center" justify="center" gap={6} className={styles.stars}>
                    {Array.from({ length: 5 }, (_, i) => {
                        const value = i + 1;
                        return (
                            <button
                                key={value}
                                type="button"
                                className={styles.starButton}
                                onClick={() => setRating(value)}
                                onMouseEnter={() => setHoverRating(value)}
                                onMouseLeave={() => setHoverRating(0)}
                                aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                            >
                                <Star
                                    size={30}
                                    fill={value <= (hoverRating || rating) ? "#FB923C" : "none"}
                                    color="#FB923C"
                                />
                            </button>
                        );
                    })}
                </Container>

                <Input
                    multiline
                    rows={3}
                    label="Commentaire (optionnel)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Décrivez votre expérience..."
                    disabled={isLoading}
                />

                <Error error={error} />

                <Container direction="row" gap={10} className={styles.actions}>
                    <Button label="Annuler" variant="ghost" fullWidth onClick={onClose} disabled={isLoading} />
                    <Button
                        label="Envoyer"
                        variant="main"
                        fullWidth
                        onClick={handleSubmit}
                        loading={isLoading}
                        disabled={rating === 0}
                    />
                </Container>
            </Container>
        </Popup>
    );
}
