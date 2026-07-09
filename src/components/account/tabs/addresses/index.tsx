// src/components/account/tabs/addresses/index.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddresses } from "@/hooks/useAddresses";
import AddressCard from "./AddressCard";
import AddressEmptyState from "./AddressEmptyState";
import AddressFormModal from "@/components/shared/AddressFormModal";
import type { Address } from "@/types";

type AddressFormData = Omit<Address, "id" | "user_id" | "created_at">;

type AddressesTabProps = {
  userId: string;
};

export default function AddressesTab({ userId }: AddressesTabProps) {
  const { addresses, isLoading, error, handleAdd, handleUpdate, handleDelete } =
    useAddresses(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSave = async (data: AddressFormData) => {
    if (editingAddress) {
      await handleUpdate(editingAddress.id, data);
    } else {
      await handleAdd(data);
    }
  };

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
        {addresses.length > 0 && (
          <Button
            onClick={openAddModal}
            className="bg-[#1F3D2E] text-white hover:opacity-90"
          >
            <Plus size={16} className="mr-2" />
            Add New Address
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="mt-6 text-sm text-[#5C5C4E]">Loading addresses...</p>
      )}

      {/* Error */}
      {error && <p className="mt-6 text-sm text-[#C0392B]">{error}</p>}

      {/* Address grid */}
      {!isLoading && !error && addresses.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}

          {/* Add another address card */}
          <button
            onClick={openAddModal}
            className="flex min-h-50 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#D8D6C0] p-6 transition-colors hover:border-[#1F3D2E]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1E7D0] text-[#1F3D2E]">
              <Plus size={20} />
            </span>
            <div className="text-center">
              <p className="font-medium text-[#1B1B1B]">Add another address</p>
              <p className="mt-1 text-xs text-[#5C5C4E]">
                Save more addresses for faster checkout
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Empty state — only when no addresses exist */}
      {!isLoading && !error && addresses.length === 0 && (
        <AddressEmptyState onAdd={openAddModal} />
      )}

      {/* Reusable modal */}
      <AddressFormModal
        key={editingAddress?.id ?? "new"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={
          editingAddress
            ? {
                label: editingAddress.label,
                full_name: editingAddress.full_name,
                phone: editingAddress.phone,
                address_line1: editingAddress.address_line1,
                address_line2: editingAddress.address_line2 ?? "",
                city: editingAddress.city,
                state: editingAddress.state,
                pincode: editingAddress.pincode,
                is_default: editingAddress.is_default,
              }
            : undefined
        }
        title={editingAddress ? "Edit Address" : "Add New Address"}
      />
    </div>
  );
}
