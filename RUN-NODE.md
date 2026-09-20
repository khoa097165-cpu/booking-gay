# Chạy Luna Talent

Không cần `cd server`.

## 1. Mở terminal ngay tại thư mục project

```powershell
npm install
```

## 2. Tạo file .env

```powershell
Copy-Item .env.example .env
notepad .env
```

Điền `MONGODB_URI` và `JWT_SECRET` của bạn.

## 3. Tạo dữ liệu demo

```powershell
npm run seed
```

## 4. Chạy web

```powershell
npm run dev
```

Mở http://localhost:4000

Tài khoản demo sau khi seed:
- Admin: admin / 123
- Nhân viên: nhanvien / 123
- Khách hàng: khachhang / 123
