// src/components/account/tabs/addresses/AddressEmptyState.tsx
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type AddressEmptyStateProps = {
  onAdd: () => void;
};

export default function AddressEmptyState({ onAdd }: AddressEmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D8D6C0] py-16 text-center">
      <MapPin size={32} className="text-[#D8D6C0]" />
      <p className="mt-4 font-medium text-[#1B1B1B]">No addresses saved yet</p>
      <p className="mt-1 text-sm text-[#5C5C4E]">
        Add an address to speed up checkout
      </p>
      <Button
        onClick={onAdd}
        className="mt-6 bg-[#1F3D2E] text-white hover:opacity-90"
      >
        <Plus size={16} className="mr-2" />
        Add Your First Address
      </Button>
    </div>
  );
}
