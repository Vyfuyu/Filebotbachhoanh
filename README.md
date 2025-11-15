# 🤖 BOT MESSENGER FACEBOOK

Bot Messenger tự động với hệ thống module đầy đủ, menu đẹp và nhiều tính năng.

## ✨ TÍNH NĂNG

### 🔐 Đăng nhập tự động
- Hỗ trợ đăng nhập bằng `appstate.json` hoặc `cookie.txt`
- Tự động lưu và cập nhật appstate
- Không cần nhập mật khẩu lại

### 📋 Hệ thống Menu
- Menu phân loại theo danh mục (Trò chơi, Hệ thống, Công cụ...)
- Chọn danh mục bằng cách reply số
- Tự động cập nhật khi thêm module mới
- Gửi kèm ảnh/video ngẫu nhiên khi hiển thị menu
- Quản lý media: thêm/xóa ảnh và video

### 🎮 Module có sẵn
- **Hệ thống**: admin, help, menu, uptime, ping
- **Trò chơi**: taixiu, slot
- **Công cụ**: time, avatar

### 👑 Quản lý Admin
- Admin ID: `61573986054035`
- Chỉ admin mới có thể thêm/xóa media cho menu

## 📥 HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Lấy Appstate hoặc Cookie

#### Cách 1: Sử dụng Appstate (Khuyến nghị)
1. Cài extension [c3c-fbstate](https://chromewebstore.google.com/detail/c3c-fbstate/piomkeolpljfmokoimohpkocjebmmjep) hoặc tương tự
2. Đăng nhập Facebook trên trình duyệt
3. Dùng extension để lấy appstate
4. Copy toàn bộ nội dung và dán vào file `appstate.json`

#### Cách 2: Sử dụng Cookie
1. Lấy cookie từ Facebook
2. Dán vào file `cookie.txt`

### Bước 2: Chạy Bot
Bot sẽ tự động chạy khi bạn cung cấp appstate.json hoặc cookie.txt hợp lệ.

## 📖 HƯỚNG DẪN SỬ DỤNG

### Prefix: `%`

### Lệnh cơ bản:
```
%menu              - Hiển thị menu danh mục
%menu all          - Xem tất cả lệnh
%help              - Xem hướng dẫn
%help <tên lệnh>   - Xem chi tiết lệnh
%admin             - Kiểm tra quyền admin
```

### Quản lý Media (Chỉ Admin):
```
%menu addvideo <link>     - Thêm video vào menu
%menu addimage <link>     - Thêm ảnh vào menu
%menu delvideo            - Xóa video (reply số để chọn)
%menu delimage            - Xóa ảnh (reply số để chọn)
%menu listmedia           - Xem danh sách media
```

### Trò chơi:
```
%taixiu <tai/xiu>  - Chơi tài xỉu
%slot              - Quay slot game
```

### Công cụ:
```
%time              - Xem thời gian
%avatar            - Lấy avatar (reply tin nhắn để lấy avatar người đó)
%uptime            - Xem thời gian bot hoạt động
%ping              - Kiểm tra tốc độ phản hồi
```

## 🔧 TẠO MODULE MỚI

Tạo file mới trong thư mục `modules/` với cấu trúc:

```javascript
module.exports = {
    config: {
        name: 'tenlenh',           // Tên lệnh
        version: '1.0.0',
        author: 'Tên bạn',
        cooldown: 5,               // Thời gian chờ (giây)
        category: 'Danh mục',      // Hệ thống, Trò chơi, Công cụ...
        description: 'Mô tả lệnh',
        adminOnly: false           // true nếu chỉ admin dùng được
    },
    run: async ({ api, event, args, config, commands }) => {
        const { threadID, messageID } = event;
        
        // Code xử lý lệnh ở đây
        api.sendMessage('Nội dung tin nhắn', threadID);
    }
};
```

### Xử lý reply tin nhắn:

```javascript
module.exports = {
    config: { ... },
    run: async ({ api, event, args }) => { ... },
    handleReply: async ({ api, event, config }) => {
        // Xử lý khi người dùng reply tin nhắn
    }
};
```

## 📂 CẤU TRÚC THƯ MỤC

```
├── modules/              # Các module lệnh
│   ├── admin.js
│   ├── menu.js
│   ├── help.js
│   └── ...
├── data/                 # Dữ liệu
│   ├── config.json       # Cấu hình bot
│   └── menuMedia.json    # Danh sách ảnh/video menu
├── index.js              # File chính
├── appstate.json         # Appstate Facebook
├── cookie.txt            # Cookie Facebook (nếu dùng)
└── package.json
```

## ⚙️ CẤU HÌNH

File `data/config.json`:
```json
{
  "prefix": "%",
  "adminID": "61573986054035",
  "botName": "Bot Messenger"
}
```

## 🎨 DANH MỤC MODULE

Module sẽ tự động được phân loại theo `category`:
- 🎮 **Trò chơi** - Các game vui
- ⚙️ **Hệ thống** - Quản lý bot
- 🔧 **Công cụ** - Tiện ích
- ℹ️ **Thông tin** - Tra cứu
- 🎬 **Media** - Ảnh, video, nhạc
- 🤖 **AI** - Trí tuệ nhân tạo
- 💰 **Kinh tế** - Tiền tệ, game economy
- 👥 **Nhóm** - Quản lý nhóm
- 👑 **Admin** - Lệnh admin

## 📝 LƯU Ý

1. **Appstate** sẽ tự động được cập nhật mỗi lần bot khởi động
2. **Cooldown** giúp tránh spam lệnh
3. **Admin ID** được cấu hình trong `data/config.json`
4. Module mới sẽ **tự động** xuất hiện trong menu
5. Media cho menu được lưu trong `data/menuMedia.json`

## 🔒 BẢO MẬT

- ⚠️ **KHÔNG** chia sẻ file `appstate.json` hoặc `cookie.txt`
- ⚠️ **KHÔNG** commit các file này lên GitHub
- ⚠️ Giữ Admin ID của bạn an toàn

## 🆘 HỖ TRỢ

Nếu gặp lỗi:
1. Kiểm tra `appstate.json` hoặc `cookie.txt` có hợp lệ
2. Xem log console để biết lỗi cụ thể
3. Đảm bảo các package đã được cài đặt: `npm install`

## 📄 LICENSE

MIT License - Tự do sử dụng và chỉnh sửa.

---

💡 **Tip**: Thêm nhiều module để bot phong phú hơn!
🎉 **Chúc bạn sử dụng bot vui vẻ!**
