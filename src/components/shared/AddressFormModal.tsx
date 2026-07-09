// src/components/shared/AddressFormModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "@/types";

type AddressFormData = Omit<Address, "id" | "user_id" | "created_at">;

type AddressFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressFormData) => Promise<void>;
  initialData?: AddressFormData;
  title?: string;
};

const DEFAULT_FORM: AddressFormData = {
  label: "Home",
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

export default function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Add New Address",
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<AddressFormData>(
    initialData ?? DEFAULT_FORM,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when modal opens/closes or initialData changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.full_name.trim() ||
      !formData.phone.trim() ||
      !formData.address_line1.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      setFormError("Failed to save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal panel */}
      <div className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 sm:max-w-lg sm:rounded-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-medium text-[#1B1B1B]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1 text-[#5C5C4E] transition-colors hover:bg-[#EDEFDD]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Label selector */}
          <div>
            <Label className="text-[#1B1B1B]">Label</Label>
            <div className="mt-2 flex gap-3">
              {["Home", "Work", "Other"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, label: option }))
                  }
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    formData.label === option
                      ? "bg-[#1F3D2E] text-white"
                      : "border border-[#D8D6C0] text-[#1B1B1B] hover:border-[#1F3D2E]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="full_name" className="text-[#1B1B1B]">
                Full Name *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    full_name: e.target.value,
                  }))
                }
                placeholder="Full name"
                className="mt-1.5 border-[#D8D6C0] py-5"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#1B1B1B]">
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="+91 00000 00000"
                className="mt-1.5 border-[#D8D6C0] py-5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address_line1" className="text-[#1B1B1B]">
              Address Line 1 *
            </Label>
            <Input
              id="address_line1"
              value={formData.address_line1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address_line1: e.target.value,
                }))
              }
              placeholder="House/Flat No., Street, Area"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          <div>
            <Label htmlFor="address_line2" className="text-[#1B1B1B]">
              Address Line 2 <span className="text-[#5C5C4E]">(optional)</span>
            </Label>
            <Input
              id="address_line2"
              value={formData.address_line2 ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address_line2: e.target.value,
                }))
              }
              placeholder="Landmark, nearby area"
              className="mt-1.5 border-[#D8D6C0] py-5"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="city" className="text-[#1B1B1B]">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                placeholder="City"
                className="mt-1.5 border-[#D8D6C0] py-5"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-[#1B1B1B]">
                State *
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
                placeholder="State"
                className="mt-1.5 border-[#D8D6C0] py-5"
              />
            </div>
            <div>
              <Label htmlFor="pincode" className="text-[#1B1B1B]">
                Pincode *
              </Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pincode: e.target.value,
                  }))
                }
                placeholder="000000"
                className="mt-1.5 border-[#D8D6C0] py-5"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_default: e.target.checked,
                }))
              }
              className="h-4 w-4 accent-[#1F3D2E]"
            />
            <span className="text-sm text-[#1B1B1B]">
              Set as default address
            </span>
          </label>

          {formError && <p className="text-sm text-[#C0392B]">{formError}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#1F3D2E] py-5 text-white hover:opacity-90"
            >
              {isSaving ? "Saving..." : title}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#D8D6C0] py-5 text-[#1B1B1B]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
