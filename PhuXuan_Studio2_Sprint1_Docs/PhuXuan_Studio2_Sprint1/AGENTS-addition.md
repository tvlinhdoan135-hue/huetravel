# Khối bổ sung cho AGENTS.md — Điều hướng và màn hình

## Điều hướng

- Trước khi sửa, đọc `docs/ROUTES.md`, `docs/TASKS.md` và kiểm tra phiên bản router trong `package.json`.
- Không tự ý nâng cấp hoặc cài thêm thư viện.
- Nếu dự án dùng React Router 7/8 theo Data mode: import `createBrowserRouter` và hook từ `react-router`, `RouterProvider` từ `react-router/dom`; không dùng `react-router-dom` nếu dự án đã thống nhất quy tắc này.
- Khai báo `RouteObject[]` trong `src/app/routes.tsx`; tạo router một lần trong `src/app/router.tsx`, bên ngoài component.
- Layout cha phải có `<Outlet />`; luôn có tuyến `*` dẫn tới `NotFoundPage`.
- `useParams()` trả về chuỗi; chuyển kiểu trước khi so sánh với ID số.
- Không gọi `navigate()` trực tiếp trong thân component. Điều hướng khi render dùng `<Navigate replace />` khi phù hợp.
- Tuyến cần đăng nhập phải được bọc bằng `ProtectedRoute`.

## Màn hình và dữ liệu

- Dùng giao diện tiếng Việt có dấu, responsive và giữ phong cách hiện có của dự án Quán Huế Xưa.
- Màn hình xử lý trạng thái có dữ liệu, rỗng và không tìm thấy khi phù hợp.
- Dữ liệu món ăn lấy qua service; không viết cứng danh sách trong component trang.
- Tìm kiếm danh sách phải đồng bộ với tham số `q` trên URL.
- Chỉ sửa những tệp được nêu trong prompt. Nếu cần sửa thêm, giải thích lý do trước.
- Không xóa hoặc viết lại các component hiện có như `MonAnCard`, `MonAnList`, `Cart`, `OrderForm` nếu không có lý do và chưa được yêu cầu.
- Không tuyên bố đã test thành công nếu chưa chạy lệnh kiểm tra.
