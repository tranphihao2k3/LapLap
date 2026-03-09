"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useJWTAuth } from "@/context/JWTAuthContext";
import {
  LayoutDashboard,
  Laptop,
  Wrench,
  Settings,
  Menu,
  X,
  Package,
  ShoppingCart,
  Users,
  Bell,
  LogOut,
  FolderTree,
  Building2,
  Star,
  FileText,
  MonitorDown,
  Megaphone,
  Shield,
  UserCheck,
  DollarSign,
  Gift,
  CreditCard,
  Eye,
  MessageSquare,
  Cpu,
  Search,
  Tag,
  LayoutGrid,
  RefreshCcw,
  ArrowLeftRight,
  Warehouse,
  Wallet,
  Truck,
  Percent,
  Facebook,
  History,
  HelpCircle,
  Key,
} from "lucide-react";
import { searchMatch } from "@/lib/normalize";

// ============================================
// Types & Helpers
// ============================================
interface NavItem {
  title: string;
  href: string;
  iconEl: React.ElementType;
  keywords?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function nav(
  title: string,
  href: string,
  iconEl: React.ElementType,
  keywords?: string,
): NavItem {
  return { title, href, iconEl, keywords };
}

// ============================================
// Navigation
// ============================================
const navGroups: NavGroup[] = [
  {
    label: "",
    items: [
      nav("Tổng quan", "/admin", LayoutDashboard, "dashboard home trang chủ"),
    ],
  },
  {
    label: "Sản phẩm & Kho",
    items: [
      nav("Kho Laptop", "/admin/laptops", Laptop, "laptop máy tính"),
      nav("Sản phẩm", "/admin/products", Package, "product hàng hóa"),
      nav("Linh kiện", "/admin/linh-kien", Cpu, "parts ram ssd"),
      nav("Danh mục", "/admin/categories", FolderTree, "category loại"),
      nav("Thương hiệu", "/admin/brands", Building2, "brand hãng"),
      nav("Nhà cung cấp", "/admin/suppliers", Truck, "supplier ncc"),
      nav("Tồn kho", "/admin/inventory", Warehouse, "stock kho"),
    ],
  },
  {
    label: "Bán hàng",
    items: [
      nav("Đơn hàng", "/admin/orders", ShoppingCart, "order mua bán"),
      nav(
        "Thu cũ đổi mới",
        "/admin/buyback-orders",
        RefreshCcw,
        "buyback trade-in",
      ),
      nav("Đổi trả hàng", "/admin/returns", ArrowLeftRight, "return hoàn"),
      nav("Bảo hành", "/admin/warranty-cards", Shield, "warranty"),
      nav("Đơn sửa chữa", "/admin/services", Wrench, "repair service"),
    ],
  },
  {
    label: "Tài chính & Nhân sự",
    items: [
      nav("Thu chi", "/admin/transactions", Wallet, "transaction tiền"),
      nav("Công nợ", "/admin/debts", CreditCard, "debt nợ"),
      nav("Điểm thưởng", "/admin/loyalty-points", Gift, "loyalty point"),
      nav("Chấm công", "/admin/attendance", UserCheck, "attendance nhân viên"),
      nav("Lương", "/admin/salary", DollarSign, "salary pay"),
    ],
  },
  {
    label: "Khách hàng & CRM",
    items: [
      nav("Khách hàng", "/admin/customers", Users, "customer crm"),
      nav("Đánh giá", "/admin/reviews", Star, "review sao"),
      nav("Phản hồi", "/admin/feedback", MessageSquare, "feedback góp ý"),
      nav("Khách thăm", "/admin/visitors", Eye, "visitor analytics"),
    ],
  },
  {
    label: "Nội dung",
    items: [
      nav("Blog", "/admin/blog", FileText, "blog bài viết"),
      nav(
        "Driver & Phần mềm",
        "/admin/software",
        MonitorDown,
        "driver software",
      ),
      nav("Bản quyền", "/admin/licenses", Key, "license key bản quyền"),
      nav("FAQ", "/admin/faqs", HelpCircle, "faq hỏi đáp"),
      nav(
        "Nhóm Facebook",
        "/admin/facebook-groups",
        Facebook,
        "facebook group",
      ),
    ],
  },
  {
    label: "Marketing",
    items: [
      nav("Mã giảm giá", "/admin/coupons", Tag, "coupon voucher"),
      nav("Banner", "/admin/banners", LayoutGrid, "banner slide"),
      nav("Popup", "/admin/popup-banners", Megaphone, "popup quảng cáo"),
      nav("Khuyến mãi", "/admin/promotions", Percent, "promotion sale"),
    ],
  },
  {
    label: "Hệ thống",
    items: [
      nav("Quản trị viên", "/admin/users", Shield, "admin user tài khoản"),
      nav("Lịch sử thao tác", "/admin/audit-logs", History, "audit log"),
      nav("Thông báo", "/admin/notifications", Bell, "notification"),
      nav("Cài đặt", "/admin/settings", Settings, "setting cấu hình"),
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

// ============================================
// Command Palette (fullscreen menu)
// ============================================
function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return navGroups;
    const q = query.trim();
    return navGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            searchMatch(q, item.title) ||
            searchMatch(q, item.href) ||
            (item.keywords && searchMatch(q, item.keywords)) ||
            (g.label && searchMatch(q, g.label)),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const flatFiltered = useMemo(
    () => filteredGroups.flatMap((g) => g.items),
    [filteredGroups],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.querySelector('[data-selected="true"]');
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
      e.preventDefault();
      router.push(flatFiltered[selectedIndex].href);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />

      {/* Content - centered layout */}
      <div
        className="relative h-full flex flex-col items-center overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors z-10"
        >
          <X size={16} />
          <span className="hidden sm:inline">Đóng</span>
        </button>

        {/* Spacer - pushes search to center when no results, shrinks when results appear */}
        <div
          className={`transition-all duration-300 ${hasQuery && filteredGroups.length > 0 ? "h-[8vh]" : "h-[25vh]"}`}
        />

        {/* Search box - always centered horizontally */}
        <div className="w-full max-w-xl px-4 flex-shrink-0">
          <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-2xl">
            <Search size={22} className="text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm công cụ, trang quản lý..."
              className="flex-1 text-lg bg-transparent outline-none text-white placeholder:text-slate-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 px-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[10px]">
                ↑↓
              </kbd>{" "}
              Di chuyển
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[10px]">
                Enter
              </kbd>{" "}
              Mở
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[10px]">
                Esc
              </kbd>{" "}
              Đóng
            </span>
          </div>
        </div>

        {/* Results - appear below the search box */}
        <div ref={listRef} className="w-full max-w-3xl px-4 mt-6 pb-10">
          {filteredGroups.length > 0 ? (
            <div className="space-y-5">
              {filteredGroups.map((group) => (
                <div key={group.label || "_root"}>
                  {group.label && (
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                      {group.label}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                    {group.items.map((item) => {
                      const Icon = item.iconEl;
                      const globalIdx = flatFiltered.indexOf(item);
                      const isSelected = globalIdx === selectedIndex;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname === item.href ||
                            pathname.startsWith(item.href + "/");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          data-selected={isSelected}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                            ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : isActive
                                  ? "bg-white/10 text-white"
                                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }
                          `}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-blue-500" : "bg-white/5"}`}
                          >
                            <Icon size={18} />
                          </div>
                          <span className="font-medium text-sm truncate">
                            {item.title}
                          </span>
                          {isActive && !isSelected && (
                            <span className="ml-auto text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                              Đang mở
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : hasQuery ? (
            <div className="py-12 text-center">
              <Search size={40} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-base">
                Không tìm thấy &ldquo;{query}&rdquo;
              </p>
              <p className="text-slate-600 text-sm mt-1">Thử từ khóa khác</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Header (only UI element - no sidebar)
// ============================================
function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { user, logout } = useJWTAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getPageTitle = () => {
    const match = allNavItems.find(
      (item) =>
        item.href === pathname ||
        (item.href !== "/admin" && pathname.startsWith(item.href + "/")),
    );
    return match?.title || "Admin";
  };

  const PageIcon =
    allNavItems.find(
      (item) =>
        item.href === pathname ||
        (item.href !== "/admin" && pathname.startsWith(item.href + "/")),
    )?.iconEl || LayoutDashboard;

  const handleLogout = () => {
    logout();
    router.push("/admin/(auth)/login");
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200/80">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Menu button + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPalette}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Menu (Ctrl+K)"
          >
            <Menu size={20} />
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-800">
            <PageIcon size={18} className="text-slate-400" />
            <h2 className="text-sm font-semibold">{getPageTitle()}</h2>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Search size={14} className="text-slate-400" />
            <span className="text-sm text-slate-400">Tìm kiếm...</span>
            <kbd className="hidden md:inline text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Ctrl+K
            </kbd>
          </button>
          <button className="relative p-2 hover:bg-slate-100 rounded-lg">
            <Bell size={18} className="text-slate-500" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================
// Main Layout
// ============================================
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col min-h-screen">
        <Header onOpenPalette={openPalette} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
