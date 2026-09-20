# Luna Talent — Node + MongoDB + 3 Roles

Bản này chạy frontend và backend trên cùng Node/Express server.

## 1. Cài đặt

```powershell
cd server
npm install
Copy-Item .env.example .env
notepad .env
```

Điền `MONGODB_URI` và `JWT_SECRET` thật vào `.env`.

## 2. Seed tài khoản demo

```powershell
npm run seed
```

Tài khoản demo:

- Admin: `admin@lunatalent.vn` / `Admin@123456`
- Nhân viên: `staff@lunatalent.vn` / `Staff@123456`
- Khách hàng: `customer@lunatalent.vn` / `Customer@123456`

Đổi mật khẩu demo trước khi deploy production.

## 3. Chạy

```powershell
npm run dev
```

Mở: `http://localhost:4000`

## Quyền

- Admin: thống kê, xem user/talent/booking, khóa/mở tài khoản, xác nhận/từ chối booking.
- Nhân viên/Talent: xem hồ sơ và booking được giao, xác nhận/từ chối booking.
- Khách hàng: xem talent, tạo booking, xem lịch sử booking.
