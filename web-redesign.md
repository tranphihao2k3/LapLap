# 📋 Plan: Web Redesign - LapLap Premium Bento Edition

> **Mục tiêu:** Chuyển đổi giao diện hiện tại sang phong cách Bento Grid kết hợp Glassmorphism cao cấp, tăng trải nghiệm người dùng và tỷ lệ chuyển đổi.

---

## 🏗️ Project Overview
- **Project Type:** WEB (Next.js + Tailwind CSS)
- **Primary Agent:** `frontend-specialist`
- **Design Language:** Bento Grid (Bố cục ô vuông), Glassmorphism (Hiệu ứng kính), Modern Typography (Be Vietnam Pro).

---

## 🎯 Success Criteria
- [ ] Giao diện hiện đại, chuẩn 2025.
- [ ] Điểm UX Audit > 90.
- [ ] Responsive hoàn hảo trên Mobile (Touch targets > 44px).
- [ ] Tích hợp mượt mà các hiệu ứng chuyển động (Framer Motion).

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15
- **Styling:** Tailwind CSS 4
- **Components:** Headless UI / Lucide React
- **Animations:** Framer Motion

---

## 📋 Task Breakdown

### Phase 1: Foundation & Design System
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T1 | Cấu hình Design Tokens (Color, Shadows, Glass) | `frontend-specialist` | `frontend-design` | P0 | None |
| T2 | Cấu hình Typography (Be Vietnam Pro) | `frontend-specialist` | `frontend-design` | P1 | None |

### Phase 2: Core Components Redesign
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T3 | Thiết kế lại Navbar (Glassmorphism & Floating) | `frontend-specialist` | `frontend-design` | P1 | T1 |
| T4 | Thiết kế lại Footer (Bento Style) | `frontend-specialist` | `frontend-design` | P2 | T1 |

### Phase 3: Homepage Lột Xác (Bento Style)
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T5 | Redesign Hero Section (Bento Grid Layout) | `frontend-specialist` | `frontend-design` | P0 | T3 |
| T6 | Redesign Product Categories (Bento Grid) | `frontend-specialist` | `frontend-design` | P1 | T5 |
| T7 | Thêm hiệu ứng Scroll Reveal (Framer Motion) | `frontend-specialist` | `clean-code` | P2 | T6 |

### Phase 4: Product Detail Page Redesign
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T8 | Layout chi tiết sản phẩm dạng Bento Boxes | `frontend-specialist` | `frontend-design` | P1 | T1 |
| T9 | Tối ưu Mobile Trust Tray & CTAs | `frontend-specialist` | `mobile-design` | P1 | T8 |

---

## ✅ PHASE X: VERIFICATION

- [ ] **UX Audit:** Chạy `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] **Security:** Chạy `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] **Lighthouse:** Chạy `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000`
- [ ] **Build Check:** `npm run build` thành công.

---
**Ghi chú:** Kế hoạch này sẽ được cập nhật dựa trên lựa chọn Màu sắc và Chế độ (Light/Dark) của người dùng.
