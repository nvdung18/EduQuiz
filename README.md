
# EduQuiz
## Giới thiệu

EduQuiz là một nền tảng học tập trực tuyến cho phép người dùng tạo và học tập thông qua thẻ ghi nhớ (flashcards).

## Tính năng chính
- **Quản lý khóa học**: Tạo, chỉnh sửa và tổ chức các khóa học theo thư mục
- **Thẻ ghi nhớ (Flashcards)**: Tạo thẻ học với thuật ngữ và định nghĩa
- **Chế độ học tập đa dạng**:
  - Chế độ thẻ ghi nhớ với khả năng lật thẻ
  - Tự động cuộn thẻ để học liên tục
  - Trộn thẻ để học ngẫu nhiên
  - Chức năng đọc to (text-to-speech) để hỗ trợ học nghe
- **Tìm kiếm**: Tìm kiếm nhanh các khóa học và thẻ học
- **Hỗ trợ hình ảnh**: Thêm hình ảnh vào thẻ học để tăng hiệu quả ghi nhớ
- **Sắp xếp thẻ**: Sắp xếp thẻ theo thứ tự bảng chữ cái,.....

## Công nghệ sử dụng
- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript, jQuery, Bootstrap
- **Cơ sở dữ liệu**: MongoDB
- **File Storage**: Firebase

## Cài đặt

### Yêu cầu hệ thống
- Node.js (v12 trở lên)
- MongoDB
- npm hoặc yarn

### Các bước cài đặt

-  Clone repository:
```bash
git clone https://github.com/your-username/EduQuiz.git
cd EduQuiz
```

-  Cài đặt dependencies:
```bash
npm install
```

-  Tạo file .env từ file .env.example và cấu hình các biến môi trường:
```bash
cp .env.example .env
```

- Khởi động server:

```bash
npm start
```