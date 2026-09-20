# Render deploy
1. Push source lên GitHub. `.env` được bỏ qua bởi `.gitignore`.
2. Tạo Cloudinary và lấy CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
3. Render > New Web Service > kết nối repo. Build: `npm install`; Start: `npm start`.
4. Render > Environment: thêm MONGODB_URI, JWT_SECRET và 3 biến CLOUDINARY ở trên; NODE_ENV=production.
5. Không cần PORT: Render tự cấp và `server.js` đã đọc `process.env.PORT`.
6. MongoDB Atlas phải cho phép kết nối từ deployment Render.
7. Test `/api/health` sau deploy.

Ảnh Talent upload mới sẽ lên Cloudinary và MongoDB lưu HTTPS URL, nên không mất khi Render redeploy. Ảnh local cũ không tự migrate; hãy upload lại ảnh đó sau khi deploy hoặc cập nhật URL Cloudinary trong MongoDB.
