import { useCallback, useEffect, useRef, useState } from "react";
import parcelService from "@/features/parcel/services/parcel.service";
import type { ParcelImageDto } from "@/shared/types";
import type { AppError } from "@/shared/types/AppError";

const MAX_IMAGES = 5;

// crypto.randomUUID() is only exposed in secure contexts (HTTPS/localhost);
// this stays valid over plain HTTP too since it only tracks staged uploads locally.
function generateLocalId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export type ParcelImageUploadItem = {
    localId: string;
    previewUrl: string;
    image?: ParcelImageDto;
    isUploading?: boolean;
    errorMessage?: string;
};

function initialImageItems(images: ParcelImageDto[] = []): ParcelImageUploadItem[] {
    return images
        .filter((image) => !!image.id)
        .map((image) => ({ localId: image.id!, previewUrl: image.url ?? "", image }));
}

export default function useParcelImages(initialImages?: ParcelImageDto[]) {

    const [images, setImages] = useState<ParcelImageUploadItem[]>(() => initialImageItems(initialImages));
    const imagesRef = useRef<ParcelImageUploadItem[]>([]);
    const removedRef = useRef<Set<string>>(new Set());
    const remainingImages = MAX_IMAGES - images.length;

    useEffect(() => {
        imagesRef.current = images;
    }, [images]);

    useEffect(() => () => {
        imagesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    }, []);

    const addImages = useCallback((parcelId: string, files: FileList | File[]) => {
        const accepted = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, MAX_IMAGES - imagesRef.current.length);
        if (accepted.length === 0) return;

        const staged: ParcelImageUploadItem[] = accepted.map((file) => ({
            localId: generateLocalId(),
            previewUrl: URL.createObjectURL(file),
            isUploading: true,
        }));
        setImages((prev) => [...prev, ...staged]);

        staged.forEach((item, i) => {
            parcelService.uploadParcelImage(parcelId, accepted[i])
                .then((image) => {
                    if (removedRef.current.has(item.localId)) {
                        void parcelService.removeParcelImage(parcelId, image.id!);
                        return;
                    }
                    setImages((prev) => prev.map((it) => {
                        if (it.localId !== item.localId) return it;
                        if (image.url) URL.revokeObjectURL(it.previewUrl);
                        return { ...it, isUploading: false, image, previewUrl: image.url ?? it.previewUrl };
                    }));
                })
                .catch((err: AppError) => {
                    if (removedRef.current.has(item.localId)) return;
                    setImages((prev) => prev.map((it) => (
                        it.localId === item.localId
                            ? { ...it, isUploading: false, errorMessage: err.message }
                            : it
                    )));
                });
        });
    }, []);

    const removeImage = useCallback((parcelId: string, localId: string) => {
        const item = imagesRef.current.find((it) => it.localId === localId);
        if (!item) return;
        removedRef.current.add(localId);
        URL.revokeObjectURL(item.previewUrl);
        if (item.image) void parcelService.removeParcelImage(parcelId, item.image.id!);
        setImages((prev) => prev.filter((it) => it.localId !== localId));
    }, []);

    return {
        images,
        maxImages: MAX_IMAGES,
        remainingImages,
        isImagesFull: remainingImages <= 0,
        addImages,
        removeImage,
    };
}
