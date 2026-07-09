// src/components/account/tabs/AddressesTab.tsx
"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Home, Briefcase, MapPin } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "@/types";

type AddressFormData = Omit<Address, "id" | "user_id" | "created_at">;

const LABEL_ICONS: Record<string, React.ElementType> = {
  Home,
  Work: Briefcase,
  Other: MapPin,
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

type AddressesTabProps = {
  userId: string;
};

export default function AddressesTab({ userId }: AddressesTabProps) {
  const { addresses, isLoading, error, handleAdd, handleUpdate, handleDelete } =
    useAddresses(userId);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingId(null);
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
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
      if (editingId) {
        await handleUpdate(editingId, formData);
      } else {
        await handleAdd(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(DEFAULT_FORM);
    } catch {
      setFormError("Failed to save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const LabelIcon = LABEL_ICONS[formData.label] ?? MapPin;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-medium text-[#1B1B1B]">
            My Addresses
          </h2>
          <p className="mt-1 text-sm text-[#5C5C4E]">
            Manage your saved delivery addresses
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={openAddForm}
            className="bg-[#1F3D2E] text-white hover:opacity-90"
          >
            <Plus size={16} className="mr-2" />
            Add New Address
          </Button>
        )}
      </div>

      {/* Address form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-[#D8D6C0] bg-white p-6 sm:p-8">
          <h3 className="font-heading text-xl font-medium text-[#1B1B1B]">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>

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
                Address Line 2{" "}
                <span className="text-[#5C5C4E]">(optional)</span>
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

            {/* Default checkbox */}
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

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#1F3D2E] py-5 text-white hover:opacity-90"
              >
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update Address"
                    : "Save Address"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-[#D8D6C0] py-5 text-[#1B1B1B]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Address cards */}
      {isLoading ? (
        <div className="mt-6 text-sm text-[#5C5C4E]">Loading addresses...</div>
      ) : error ? (
        <p className="mt-6 text-sm text-[#C0392B]">{error}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => {
            const Icon = LABEL_ICONS[address.label] ?? MapPin;
            return (
              <div
                key={address.id}
                className="rounded-2xl border border-[#D8D6C0] bg-white p-6"
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 rounded-full border border-[#D8D6C0] px-3 py-1 text-xs font-medium text-[#1B1B1B]">
                    <Icon size={12} />
                    {address.label}
                  </span>
                  {address.is_default && (
                    <span className="rounded-full bg-[#1F3D2E] px-3 py-1 text-xs font-medium text-white">
                      Default
                    </span>
                  )}
                </div>

                {/* Address details */}
                <div className="mt-4">
                  <p className="font-medium text-[#1B1B1B]">
                    {address.full_name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C5C4E]">
                    {address.address_line1}
                    {address.address_line2 && <>, {address.address_line2}</>}
                    <br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="mt-1 text-sm text-[#5C5C4E]">{address.phone}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-[#D8D6C0] pt-4">
                  <Button
                    variant="outline"
                    onClick={() => openEditForm(address)}
                    className="border-[#D8D6C0] text-sm text-[#1B1B1B] hover:border-[#1F3D2E]"
                  >
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(address.id, address.is_default)}
                    className="flex cursor-pointer items-center gap-2 text-sm text-[#C0392B] transition-colors hover:opacity-70"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add another address card */}
          {!showForm && (
            <button
              onClick={openAddForm}
              className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#D8D6C0] p-6 transition-colors hover:border-[#1F3D2E]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E7D0] text-[#1F3D2E]">
                <Plus size={20} />
              </span>
              <div className="text-center">
                <p className="font-medium text-[#1B1B1B]">
                  Add another address
                </p>
                <p className="mt-1 text-xs text-[#5C5C4E]">
                  Save more addresses for faster checkout
                </p>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && addresses.length === 0 && !showForm && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D8D6C0] py-16 text-center">
          <MapPin size={32} className="text-[#D8D6C0]" />
          <p className="mt-4 font-medium text-[#1B1B1B]">
            No addresses saved yet
          </p>
          <p className="mt-1 text-sm text-[#5C5C4E]">
            Add an address to speed up checkout
          </p>
          <Button
            onClick={openAddForm}
            className="mt-6 bg-[#1F3D2E] text-white hover:opacity-90"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Address
          </Button>
        </div>
      )}
    </div>
  );
}
