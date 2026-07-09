// src/components/account/tabs/addresses/AddressCard.tsx
import { Pencil, Trash2, Home, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types";

const LABEL_ICONS: Record<string, React.ElementType> = {
  Home,
  Work: Briefcase,
  Other: MapPin,
};

type AddressCardProps = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string, wasDefault: boolean) => void;
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const Icon = LABEL_ICONS[address.label] ?? MapPin;

  return (
    <div className="rounded-2xl border border-[#D8D6C0] bg-white p-6">
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

      <div className="mt-4">
        <p className="font-medium text-[#1B1B1B]">{address.full_name}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#5C5C4E]">
          {address.address_line1}
          {address.address_line2 && <>, {address.address_line2}</>}
          <br />
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="mt-1 text-sm text-[#5C5C4E]">{address.phone}</p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#D8D6C0] pt-4">
        <Button
          variant="outline"
          onClick={() => onEdit(address)}
          className="border-[#D8D6C0] text-sm text-[#1B1B1B] hover:border-[#1F3D2E]"
        >
          <Pencil size={14} className="mr-2" />
          Edit
        </Button>
        <button
          onClick={() => onDelete(address.id, address.is_default)}
          className="flex cursor-pointer items-center gap-2 text-sm text-[#C0392B] transition-colors hover:opacity-70"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
