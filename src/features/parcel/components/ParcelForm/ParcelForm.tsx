import { useRef, useState } from "react";
import { Circle, MapPin } from "lucide-react";
import styles from "./ParcelForm.module.css";
import Input from "@/shared/components/input/Input";
import AddressForm from "@/features/address/components/AddressForm/AddressForm.tsx";
import Select from "@/shared/components/select/Select";
import SelectItem from "@/shared/components/select/SelectItem";
import Toggle from "@/shared/components/toggle/Toggle";
import UploadForm from "@/features/media/components/upload/UploadForm";
import useParcelImages from "@/features/parcel/hooks/useParcelImages.ts";
import Multistep from "@/shared/components/multistep/Multistep.tsx";
import Error from "@/shared/components/error/Error.tsx";
import Text from "@/shared/components/text/Text.tsx";
import Container from "@/shared/components/container/Container.tsx";
import { addressToString } from "@/shared/utils/addressToString.ts";
import type { AddressRequest, ParcelCreateRequest, ParcelImageDto } from "@/shared/types";
import type { AppError } from "@/shared/types/AppError";

const EMPTY_ADDRESS: AddressRequest = { street: "", city: "", postalCode: "", country: "France" };

const EMPTY_PARCEL: ParcelCreateRequest = {
    title: "",
    weightKg: 0,
    size: "M",
    fragile: false,
    pickupAddress: EMPTY_ADDRESS,
    dropoffAddress: EMPTY_ADDRESS,
};

type ParcelFormProps = {
    /** Create mode only: called when leaving the "Adresses" step, saves the parcel and returns its id so the (optional) Photos step can attach images. */
    onCreate?: (data: ParcelCreateRequest) => Promise<string | null>;
    /** Edit mode only: called on final submit to update the parcel. */
    onSubmit?: (data: ParcelCreateRequest) => void;
    /** Create mode only: called on final submit — the parcel and any picked images are already saved by then. */
    onFinish?: () => void;
    isLoading?: boolean;
    error?: AppError | null;
    initialValues?: Partial<ParcelCreateRequest>;
    initialImages?: ParcelImageDto[];
    parcelId?: string;
    heading?: string;
    subtitle?: string;
    submitLabel?: string;
};

export default function ParcelForm({
    onCreate,
    onSubmit,
    onFinish,
    isLoading = false,
    error = null,
    initialValues,
    initialImages,
    parcelId,
    heading = "Envoyer un colis",
    subtitle = "Renseignez les détails de votre colis ainsi que les adresses d'enlèvement et de livraison",
    submitLabel = "Envoyer le colis",
}: ParcelFormProps) {

    const isCreateMode = !parcelId;

    const [parcel, setParcel] = useState<ParcelCreateRequest>(() => ({ ...EMPTY_PARCEL, ...initialValues }));
    const [pickupQuery, setPickupQuery] = useState(() => addressToString(initialValues?.pickupAddress));
    const [dropoffQuery, setDropoffQuery] = useState(() => addressToString(initialValues?.dropoffAddress));
    const [step, setStep] = useState(0);
    const [createdParcelId, setCreatedParcelId] = useState<string | undefined>(parcelId);
    const formRef = useRef<HTMLFormElement>(null);
    const { images, maxImages, remainingImages, isImagesFull, addImages, removeImage } = useParcelImages(initialImages);

    function buildPayload(): ParcelCreateRequest {
        return {
            title: parcel.title || undefined,
            weightKg: parcel.weightKg,
            size: parcel.size,
            fragile: parcel.fragile,
            pickupAddress: parcel.pickupAddress,
            dropoffAddress: parcel.dropoffAddress,
        };
    }

    async function handleNext() {
        if (formRef.current && !formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }
        if (isCreateMode && step === 1 && !createdParcelId) {
            const newId = await onCreate?.(buildPayload());
            if (!newId) return;
            setCreatedParcelId(newId);
        }
        setStep((s) => Math.min(s + 1, 2));
    }

    function updateField<K extends keyof ParcelCreateRequest>(field: K, value: ParcelCreateRequest[K]) {
        setParcel((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isCreateMode) {
            onFinish?.();
        } else {
            onSubmit?.(buildPayload());
        }
    }

    return (
        <div className={styles.container}>
            <Error error={error} />

            <Container gap={0} className={styles.heading}>
                <Text tag="h1" weight="bold" size={2}>{heading}</Text>
                <Text tag="p" className={styles.subtitle}>{subtitle}</Text>
            </Container>

            <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
                <Multistep
                    current={step}
                    onNext={handleNext}
                    onBack={() => setStep((s) => Math.max(s - 1, 0))}
                    finishType="submit"
                    finishLabel={submitLabel}
                    isLoading={isLoading}
                    nextDisabled={isLoading}
                    steps={[
                        {
                            label: "Infos",
                            content: (
                                <div className={styles.parcel_details}>
                                    <Input
                                        id="title"
                                        name="title"
                                        label="Titre"
                                        placeholder="Vase en bois"
                                        value={parcel.title}
                                        required
                                        onChange={(e) => updateField("title", e.target.value)}
                                        error={error?.fields.title}
                                    />

                                    <div className={styles.ligne}>
                                        <Input
                                            id="weightKg"
                                            name="weightKg"
                                            type="number"
                                            label="Poids"
                                            placeholder="2.4"
                                            value={parcel.weightKg === 0 ? "" : String(parcel.weightKg)}
                                            required
                                            suffix={<span className={styles.unit}>kg</span>}
                                            onChange={(e) => updateField("weightKg", e.target.value === "" ? 0 : Number(e.target.value))}
                                            error={error?.fields.weightKg}
                                        />

                                        <Select
                                            id="size"
                                            label="Taille"
                                            value={parcel.size}
                                            onChange={(value) => updateField("size", value as ParcelCreateRequest["size"])}
                                            error={error?.fields.size}
                                        >
                                            <SelectItem value="S">Petit - 20x15x10cm</SelectItem>
                                            <SelectItem value="M">Moyen - 35x25x15cm</SelectItem>
                                            <SelectItem value="L">Grand - 50x35x25cm</SelectItem>
                                            <SelectItem value="XL">Très grand - 65x45x35cm</SelectItem>
                                            <SelectItem value="XXL">Très très grand - 80x60x45cm</SelectItem>
                                        </Select>
                                    </div>

                                    <Toggle
                                        id="fragile"
                                        label="Colis fragile"
                                        description="À manipuler avec précaution"
                                        checked={parcel.fragile ?? false}
                                        onChange={(checked) => updateField("fragile", checked)}
                                        className={styles.fragile_toggle}
                                    />
                                </div>
                            ),
                        },
                        {
                            label: "Adresses",
                            content: (
                                <div className={styles.addresses_row}>
                                    <AddressForm
                                        id="pickupAddress"
                                        icon={<Circle size={13} />}
                                        label="Enlèvement"
                                        value={pickupQuery}
                                        required
                                        onChange={setPickupQuery}
                                        onSelect={(address) => updateField("pickupAddress", address)}
                                        error={error?.fields.pickupAddress}
                                    />
                                    <AddressForm
                                        id="dropoffAddress"
                                        icon={<MapPin size={13} />}
                                        label="Livraison"
                                        value={dropoffQuery}
                                        required
                                        onChange={setDropoffQuery}
                                        onSelect={(address) => updateField("dropoffAddress", address)}
                                        error={error?.fields.dropoffAddress}
                                    />
                                </div>
                            ),
                        },
                        {
                            label: "Photos",
                            content: createdParcelId ? (
                                <UploadForm
                                    scope="Photos (optionnel)"
                                    max={maxImages}
                                    remaining={remainingImages}
                                    isFull={isImagesFull}
                                    items={images}
                                    onAddFiles={(files) => addImages(createdParcelId, files)}
                                    onRemoveItem={(item) => removeImage(createdParcelId, item.localId)}
                                />
                            ) : null,
                        },
                    ]}
                />
            </form>
        </div>
    );
}
