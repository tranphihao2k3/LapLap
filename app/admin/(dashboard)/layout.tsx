'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
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
  ChevronRight,
  ChevronDown,
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
} from 'lucide-react';













// ============================================
// Types
// ============================================
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// ============================================
// Navigation Structure
// ============================================
const navigation: NavItem[] = [
  {
    title: 'Tổng quan',
    href: '/admin',
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: 'Kho Laptop',
    href: '/admin/laptops',
    icon: <Laptop size={18} />,
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: <Package size={18} />,
  },
  {
    title: 'Linh kiện',
    href: '/admin/linh-kien',
    icon: <Cpu size={18} />,
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: <FolderTree size={18} />,
  },
  {
    title: 'Thương hiệu',
    href: '/admin/brands',
    icon: <Building2 size={18} />,
  },
  {
    title: 'Nhà cung cấp',
    href: '/admin/suppliers',
    icon: <Truck size={18} />,
  },

  {
    title: 'Đơn hàng',
    href: '/admin/orders',
    icon: <ShoppingCart size={18} />,
  },
  {
    title: 'Thu cũ đổi mới',
    href: '/admin/buyback-orders',
    icon: <RefreshCcw size={18} />,
  },
  {
    title: 'Đổi trả hàng',
    href: '/admin/returns',
    icon: <ArrowLeftRight size={18} />,
  },
  {
    title: 'Bảo hành',
    href: '/admin/warranty-cards',
    icon: <Shield size={18} />,
  },

  {
    title: 'Tồn kho',
    href: '/admin/inventory',
    icon: <Warehouse size={18} />,
  },

  {
    title: 'Thu chi',
    href: '/admin/transactions',
    icon: <Wallet size={18} />,
  },
  {
    title: 'Đơn sửa chữa',
    href: '/admin/services',
    icon: <Wrench size={18} />,
  },



  {
    title: 'Khách hàng',
    href: '/admin/customers',
    icon: <Users size={18} />,
  },
  {
    title: 'Đánh giá',
    href: '/admin/reviews',
    icon: <Star size={18} />,
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: <FileText size={18} />,
  },
  {
    title: 'Driver & Phần mềm',
    href: '/admin/software',
    icon: <MonitorDown size={18} />,
  },
  {
    title: 'Nhóm Facebook',
    href: '/admin/facebook-groups',
    icon: <Facebook size={18} />,
  },
  {
    title: 'Marketing',

    href: '/admin/marketing',
    icon: <Megaphone size={18} />,
    children: [
      { title: 'Mã giảm giá', href: '/admin/coupons', icon: <Tag size={16} /> },
      { title: 'Banner', href: '/admin/banners', icon: <LayoutGrid size={16} /> },
      { title: 'Popup', href: '/admin/popup-banners', icon: <Megaphone size={16} /> },
      { title: 'Khuyến mãi', href: '/admin/promotions', icon: <Percent size={16} /> },
    ],
  },


  {
    title: 'Nhân sự',
    href: '/admin/attendance',
    icon: <UserCheck size={18} />,
    children: [
      { title: 'Chấm công', href: '/admin/attendance', icon: <UserCheck size={16} /> },
      { title: 'Lương', href: '/admin/salary', icon: <DollarSign size={16} /> },
    ],
  },
  {
    title: 'Tài chính',
    href: '/admin/debts',
    icon: <CreditCard size={18} />,
    children: [
      { title: 'Công nợ', href: '/admin/debts', icon: <CreditCard size={16} /> },
      { title: 'Điểm thưởng', href: '/admin/loyalty-points', icon: <Gift size={16} /> },
    ],
  },
  {
    title: 'Phản hồi',
    href: '/admin/feedback',
    icon: <MessageSquare size={18} />,
  },
  {
    title: 'Khách thăm',
    href: '/admin/visitors',
    icon: <Eye size={18} />,
  },
  {
    title: 'Quản trị viên',
    href: '/admin/users',
    icon: <Shield size={18} />,
  },
  {
    title: 'Lịch sử thao tác',
    href: '/admin/audit-logs',
    icon: <History size={18} />,
  },
  {
    title: 'Thông báo',
    href: '/admin/notifications',
    icon: <Bell size={18} />,
  },
  {
    title: 'FAQ',
    href: '/admin/faqs',
    icon: <HelpCircle size={18} />,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: <Settings size={18} />,
  },



];

// ============================================
// Nav Item Component
// ============================================
function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(() => {
    if (item.children) {
      return item.children.some(
        (child) => pathname === child.href || pathname.startsWith(child.href + '/')
      );
    }
    return false;
  });

  const isActive =
    item.href === '/admin'
      ? pathname === '/admin'
      : pathname === item.href || pathname.startsWith(item.href + '/');

  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            transition-colors duration-150 text-left
            ${isActive || expanded
              ? 'bg-slate-800 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }
          `}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span className="font-medium text-sm flex-1">{item.title}</span>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {expanded && (
          <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
            {item.children!.map((child) => (
              <NavItemComponent key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-colors duration-150
        ${isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }
        ${depth > 0 ? 'py-2 text-sm' : ''}
      `}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span className="font-medium text-sm">{item.title}</span>
      {isActive && depth === 0 && <ChevronRight size={14} className="ml-auto" />}
    </Link>
  );
}

// ============================================
// Sidebar Component
// ============================================
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white
          transform transition-transform duration-200 ease-in-out
          flex flex-col
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              L
            </div>
            <div>
              <span className="text-base font-bold">LapLap</span>
              <span className="text-xs text-blue-400 ml-1">Admin</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navigation.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
              {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email || 'admin@laplap.com'}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="mt-1 flex items-center gap-3 w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ============================================
// Header Component
// ============================================
function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const getPageTitle = () => {
    const flat = navigation.flatMap((item) =>
      item.children ? [item, ...item.children] : [item]
    );
    const match = flat.find(
      (item) =>
        item.href === pathname ||
        (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
    );
    return match?.title || 'Admin';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-base font-semibold text-slate-800 hidden sm:block">
            {getPageTitle()}
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg w-56">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg">
            <Bell size={20} className="text-slate-600" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
            {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700">
            {session?.user?.name || 'Admin'}
          </span>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
