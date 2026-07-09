// src/components/account/AccountLayout.tsx
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountBottomNav from "@/components/account/AccountBottomNav";

type AccountUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
};

type AccountLayoutProps = {
  user: AccountUser;
  children: React.ReactNode;
};

export type { AccountUser };

export default function AccountLayout({ user, children }: AccountLayoutProps) {
  return (
    <div className="flex min-h-screen pt-18">
      {/* Fixed sidebar — desktop only */}
      <aside className="fixed bottom-0 left-0 top-18 hidden w-64 overflow-y-auto border-r border-[#D8D6C0] bg-[#F1E7D0] lg:block">
        <AccountSidebar user={user} />
      </aside>

      {/* Scrollable content area */}
      <main className="w-full lg:pl-64">
        <div className="mx-auto max-w-3xl px-6 pb-26 pt-10 lg:pb-10">
          {children}
        </div>
      </main>

      {/* Floating bottom nav — mobile only */}
      <AccountBottomNav />
    </div>
  );
}
