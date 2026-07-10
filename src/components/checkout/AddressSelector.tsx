// src/components/checkout/AddressSelector.tsx
"use client";

import { useState } from "react";
import { Plus, Home, Briefcase, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressFormModal from "@/components/shared/AddressFormModal";
import { createClient } from "@/lib/supabase/client";
import { addAddress } from "@/lib/supabase/queries/addresses";
import type { Address } from "@/types";

const LABEL_ICONS: Record<string, React.ElementType> = {
  Home,
  Work: Briefcase,
  Other: MapPin,
};

type AddressSelectorProps = {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
  userId: string;
};

export default function AddressSelector({
  addresses: initialAddresses,
  selectedId,
  onSelect,
  userId,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAddress = async (
    data: Omit<Address, "id" | "user_id" | "created_at">,
  ) => {
    const supabase = createClient();
    await addAddress(supabase, userId, data);

    // Refresh addresses list
    const { data: updated } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });

    if (updated) {
      setAddresses(updated as Address[]);
      // Auto-select newly added address
      const newest = updated[updated.length - 1] as Address;
      if (newest) onSelect(newest);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-medium text-[#1B1B1B]">
          Delivery Address
        </h2>
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="border-[#D8D6C0] text-sm text-[#1B1B1B] hover:border-[#1F3D2E]"
        >
          <Plus size={14} className="mr-2" />
          Add New
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-[#D8D6C0] p-8 text-center">
          <MapPin size={28} className="mx-auto text-[#D8D6C0]" />
          <p className="mt-3 text-sm font-medium text-[#1B1B1B]">
            No saved addresses
          </p>
          <p className="mt-1 text-xs text-[#5C5C4E]">
            Add an address to continue
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-[#1F3D2E] text-white hover:opacity-90"
          >
            <Plus size={14} className="mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {addresses.map((address) => {
            const Icon = LABEL_ICONS[address.label] ?? MapPin;
            const isSelected = selectedId === address.id;

            return (
              <button
                key={address.id}
                onClick={() => onSelect(address)}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#1F3D2E] bg-[#1F3D2E]/5"
                    : "border-[#D8D6C0] bg-white hover:border-[#1F3D2E]/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-[#D8D6C0] px-2.5 py-1 text-xs font-medium text-[#1B1B1B]">
                      <Icon size={11} />
                      {address.label}
                    </span>
                    {address.is_default && (
                      <span className="rounded-full bg-[#1F3D2E]/10 px-2.5 py-1 text-xs font-medium text-[#1F3D2E]">
                        Default
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-[#1F3D2E]"
                    />
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-[#1B1B1B]">
                    {address.full_name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5C5C4E]">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                    <br />
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="mt-1 text-sm text-[#5C5C4E]">{address.phone}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <AddressFormModal
        key={isModalOpen ? "open" : "closed"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAddress}
        title="Add New Address"
      />
    </div>
  );
}
