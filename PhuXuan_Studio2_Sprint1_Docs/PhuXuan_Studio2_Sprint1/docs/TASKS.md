# TASKS — Lát cắt dọc Sprint 1

> Thay các vai trò bằng tên thành viên thật trước khi nộp. Mỗi slice nên hoàn thành trong một prompt chính và tối đa ba prompt sửa.

## Slice 1: Danh sách món ăn [Sprint 1] — Người: Thành viên giao diện

- **Tuyến:** `/` và `/mon-an`
- **Màn hình:** `HomePage` / `MonAnListPage`
- **Dữ liệu:** `listMonAn(query)` trong service của tính năng món ăn.
- **Tiêu chí hoàn thành:**
  - Hiển thị ít nhất 4 món ăn từ nguồn dữ liệu/service.
  - Tìm kiếm đọc và cập nhật `?q=` trên URL.
  - Từ khóa không khớp hiển thị “Không có món ăn phù hợp”.
  - Danh sách không có dữ liệu hiển thị trạng thái rỗng.
  - Chọn một món chuyển đến `/mon-an/:id`.
  - `npm run build`, `npm run typecheck` và test khói đạt.
- **Trạng thái:** [ ] Spec [ ] Prompt [ ] Generate [ ] Review [ ] Test [ ] Commit

## Slice 2: Chi tiết món ăn [Sprint 1] — Người: Thành viên giao diện

- **Tuyến:** `/mon-an/:id`
- **Màn hình:** `MonAnDetailPage`
- **Dữ liệu:** `getMonAnById(id)` trong service.
- **Tiêu chí hoàn thành:**
  - Bấm món từ danh sách mở đúng chi tiết.
  - Hiển thị tên, hình ảnh, giá và mô tả nếu dữ liệu hiện có hỗ trợ.
  - Chuyển `id` từ chuỗi sang số trước khi tra cứu.
  - `/mon-an/999999` hiển thị “Không tìm thấy món ăn”.
  - Có đường quay lại danh sách; nút Back của trình duyệt hoạt động.
  - Không có lỗi đỏ trong Console; typecheck/build đạt.
- **Trạng thái:** [ ] Spec [ ] Prompt [ ] Generate [ ] Review [ ] Test [ ] Commit

## Slice 3: Khung điều hướng và tuyến bảo vệ [Sprint 1] — Người: Thành viên kiến trúc

- **Tuyến:** tất cả tuyến trong `docs/ROUTES.md`
- **Phạm vi:** router, root layout, trang khung, `ProtectedRoute`, `NotFoundPage`.
- **Tiêu chí hoàn thành:**
  - Tất cả tuyến mở được và có tiêu đề đúng.
  - Layout hiển thị menu và `<Outlet />`.
  - `/admin` khi chưa đăng nhập chuyển đến `/admin/login`.
  - URL không tồn tại hiển thị trang 404 của ứng dụng.
  - Không thêm thư viện ngoài yêu cầu; không dùng `react-router-dom` nếu dự án đã chốt dùng gói `react-router` theo `AGENTS.md`.
  - Build/typecheck/test đạt.
- **Trạng thái:** [ ] Spec [ ] Prompt [ ] Generate [ ] Review [ ] Test [ ] Commit

## Slice 4: Biểu mẫu đặt món [Sprint 2] — Người: Thành viên kiểm chứng

- **Tuyến:** `/dat-mon`
- **Màn hình:** `OrderPage`
- **Tiêu chí hoàn thành:** kiểm tra giỏ hàng rỗng; xác thực họ tên, số điện thoại, địa chỉ; hiển thị lỗi dễ hiểu; tạo đơn thành công và điều hướng tới trang xác nhận.
- **Trạng thái:** [ ] Spec [ ] Prompt [ ] Generate [ ] Review [ ] Test [ ] Commit

## Quy trình review chung

1. Đọc kế hoạch tệp AI đề xuất trước khi cho phép viết mã.
2. Kiểm tra `git diff --stat` và `git diff` để phát hiện sửa ngoài phạm vi.
3. Thử dữ liệu có thật, danh sách rỗng, từ khóa không khớp và ID sai.
4. Mỗi thành viên tự giải thích được phần mã mình phụ trách.
5. Chỉ commit sau khi build, typecheck và test đạt.
