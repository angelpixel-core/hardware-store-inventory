import { useEffect, useState } from "react";
import type { Product } from "../../../types/inventory";
import type {
  StockIntakeFormData,
  StockIntakeSubmitParams,
} from "../types";

export interface UseStockIntakeFormOptions {
  products: Product[];
  selectedProductId: string | null;
  onSubmit: (params: StockIntakeSubmitParams) => void;
}

export function useStockIntakeForm({
  products,
  selectedProductId,
  onSubmit,
}: UseStockIntakeFormOptions) {
  const initialProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];

  const [form, setForm] = useState<StockIntakeFormData>(() => ({
    productId: selectedProductId ?? initialProduct?.id ?? "",
    quantity: "1",
    unitCost: (initialProduct?.cost ?? 0).toString(),
    note: "",
    location: initialProduct?.location ?? {
      store: "Principal",
      aisle: "A1",
      rack: "R1",
      shelf: "S1",
    },
  }));

  const [photo, setPhoto] = useState<string | undefined>();
  const [cameraOpen, setCameraOpen] = useState(false);

  const activeProduct =
    products.find((item) => item.id === form.productId) ?? products[0];

  useEffect(() => {
    if (activeProduct && form.productId === activeProduct.id) {
      setForm((current) => ({
        ...current,
        unitCost: current.unitCost || activeProduct.cost.toString(),
        location: activeProduct.location,
      }));
    }
  }, [activeProduct, form.productId]);

  function handleProductChange(productId: string) {
    const nextProduct = products.find((item) => item.id === productId);
    setForm((current) => ({
      ...current,
      productId,
      unitCost: nextProduct?.cost.toString() ?? current.unitCost,
      location: nextProduct?.location ?? current.location,
    }));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    const qty = parseInt(form.quantity, 10);
    if (!qty || qty <= 0) return;
    onSubmit({
      productId: form.productId,
      quantity: qty,
      unitCost: form.unitCost ? parseFloat(form.unitCost) : undefined,
      note: form.note || undefined,
      location: form.location,
      photo,
    });
  }

  return {
    form,
    setForm,
    activeProduct,
    photo,
    setPhoto,
    cameraOpen,
    setCameraOpen,
    handleProductChange,
    handleFileChange,
    handleSubmit,
  };
}
