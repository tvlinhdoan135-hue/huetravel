# PROMPTS — Nhật ký sử dụng AI

## Prompt 1 — Phân tích và lập kế hoạch router Sprint 1

Bối cảnh: dự án `phu-xuan-react`, đề tài Quán Huế Xưa, React + TypeScript + Vite. Đọc `AGENTS.md`, `docs/ROUTES.md`, `docs/TASKS.md` và `package.json`.

Nhiệm vụ: kiểm tra kiến trúc hiện tại và đề xuất kế hoạch tích hợp router theo đúng tài liệu. Trước tiên chỉ phân tích, chưa sửa mã. Nêu rõ phiên bản React Router thực tế, các tệp sẽ tạo/sửa, component hiện có có thể tái sử dụng và rủi ro tương thích. Không tự ý nâng cấp thư viện.

## Prompt 2 — Tích hợp bộ tuyến

Chỉ sau khi nhóm duyệt kế hoạch: triển khai các tuyến trong `docs/ROUTES.md`, tái sử dụng component hiện có của Quán Huế Xưa. Có layout chứa menu và `Outlet`, tuyến danh sách, tuyến động chi tiết, tuyến bảo vệ `/admin`, trang đăng nhập khung và trang 404. Chỉ sửa các tệp trong kế hoạch đã duyệt. Không xóa tính năng tìm kiếm, lọc danh mục, sắp xếp hoặc giỏ hàng. Nêu danh sách tệp đã sửa.

## Prompt 3 — Hoàn thiện danh sách món ăn

Hoàn thiện màn hình danh sách món ăn theo `docs/ROUTES.md`. Tìm kiếm đồng bộ tham số `?q=` trên URL; dữ liệu đi qua service; có trạng thái danh sách rỗng và không có kết quả. Tái sử dụng `MonAnList`, `MonAnCard`, `CategorySidebar`, `SortTabs` nếu phù hợp. Không viết cứng mảng món ăn trong component trang. Không cài thư viện mới. Nêu kế hoạch tệp trước khi sửa.

## Prompt 4 — Hoàn thiện chi tiết món ăn

Hoàn thiện `/mon-an/:id`. Đọc ID từ URL, chuyển kiểu đúng trước khi tra cứu bằng service. Hiển thị chi tiết món nếu tìm thấy; nếu ID sai/không tồn tại, hiển thị “Không tìm thấy món ăn” và liên kết về danh sách. Giữ phong cách Quán Huế Xưa. Chỉ sửa tệp liên quan; không viết lại các tính năng khác.

## Prompt 5 — Review và kiểm thử

Chưa sửa mã ngay. Kiểm tra diff và đối chiếu `docs/ROUTES.md`, `docs/TASKS.md`. Tìm ít nhất hai vấn đề cụ thể về phạm vi sửa, dữ liệu, trạng thái hoặc điều hướng. Sau khi nêu vấn đề, đề xuất sửa nhỏ nhất. Cuối cùng chạy `npm run typecheck`, `npm test`, `npm run build` nếu các script tồn tại; báo chính xác lệnh nào thành công/thất bại và không đoán kết quả.
