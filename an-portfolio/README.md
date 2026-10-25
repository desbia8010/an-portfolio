# Website AN · Portfolio Đoàn Minh Duy An

Website một trang theo “Brief thiết kế website AN”: HTML, CSS, JavaScript thuần (không cần build), song ngữ Việt – Anh, đưa lên Vercel là chạy.

## 1. Đưa lên Vercel

1. Vào github.com → **New repository** → đặt tên, ví dụ `an-portfolio` → **Create repository**.
2. Trong kho vừa tạo, chọn **uploading an existing file**, kéo **toàn bộ nội dung bên trong** thư mục này (file `index.html`, thư mục `assets`, các file ảnh biểu tượng…) vào, rồi bấm **Commit changes**.
3. Vào vercel.com → đăng nhập bằng GitHub → **Add New… → Project** → chọn kho `an-portfolio` → **Deploy**. Giữ nguyên cài đặt (Framework Preset: Other).
4. Vercel cho địa chỉ dạng `https://an-portfolio.vercel.app`. Mỗi lần thêm hoặc sửa file trên GitHub, website tự cập nhật sau khoảng một phút.

Nếu máy có Node.js: mở Terminal trong thư mục này, chạy `npx vercel` và làm theo hướng dẫn.

GitHub chỉ nhận file tối đa 25 MB khi tải bằng trình duyệt: nén video CV (ví dụ HandBrake, 720p) xuống dưới mức này.

## 2. Thêm file còn thiếu

Video là tùy chọn: khi chưa có, website ẩn nút “Xem video CV” và khung clip, ảnh minh chứng chiếm chỗ. Website tự kiểm tra file: đặt đúng tên vào đúng thư mục là nội dung tự hiện, khung “thay sau” tự biến mất, không cần sửa code. Ảnh nhận `.webp`, `.jpg`, `.jpeg` hoặc `.png`; nên xuất `.webp`, rộng tối đa 1600 px (squoosh.app làm miễn phí).

| Nội dung | Thư mục | Tên file |
|---|---|---|
| Ảnh minh chứng Hình 1.1–4.6 | `assets/img/evidence/` | `1-1` … `1-7`, `2-1` … `2-5`, `3-1` … `3-4`, `4-1` … `4-6` |
| 4 ảnh slide G7 (chương T·AN) | `assets/img/evidence/` | `tan-1` thử thách TikTok, `tan-2` customer journey, `tan-3` storyboard TVC, `tan-4` OOH |
| Ảnh chân dung 4:5 | `assets/img/` | `portrait` |
| Mã QR quét xem CV (màn Liên hệ, slide 9) | `assets/img/` | `qr-cv.png`: tạo lại mã trỏ tới `https://<tên-miền>/cv` (trang chọn CV tiếng Việt / English nằm trong thư mục `cv/`) |
| Mã QR website có `?v=thay` (hình chiếu P9) | `assets/img/` | `qr-website` (.png hoặc .svg) |
| (Không bắt buộc) Video nền màn mở đầu, 8–12 giây, ≤ 4 MB | `assets/video/` | `hero-loop.mp4` (+ `hero-loop.webm`) |
| (Không bắt buộc) Video CV bản đầy đủ | `assets/video/` | `video-cv.mp4` (+ `.webm`), phụ đề `video-cv.vi.vtt`, `video-cv.en.vtt` |
| (Không bắt buộc) 5 cutdown 10–15 giây, 720p, ≤ 3 MB | `assets/video/` | `cutdown-ban`, `cutdown-lan`, `cutdown-vang`, `cutdown-toan`, `cutdown-tan` (.mp4 + .webm, phụ đề .vi.vtt và .en.vtt) |
| CV PDF (không bắt buộc) | `assets/cv/` | `DoanMinhDuyAn_CV.pdf`, `DoanMinhDuyAn_CV_EN.pdf`. Hiện nút Tải CV đã tải PDF xuất trực tiếp từ hai Google Doc CV (cấu hình `cvLink` trong `config.js`); đặt file vào đây thì website ưu tiên file này |

**Lấy nhanh ảnh minh chứng:** mở Google Doc portfolio → Tệp → Tải xuống → Trang web (.html, nén). Thư mục `images` trong file zip xếp ảnh theo thứ tự trong tài liệu: image1–7 là Hình 1.1–1.7, image8–12 là Hình 2.1–2.5, image13–16 là Hình 3.1–3.4, image17–22 là Hình 4.1–4.6. Đổi tên theo bảng trên. Ảnh chụp màn hình phải làm mờ tên người khác.

**Bình luận cuộc thi “Lặng”** cho hình chiếu P4 (đã có 5, thiếu 1): thêm vào `assets/js/content.js`, mục `p4Comments`, chỉ ghi chữ, không ghi tên, sau khi nhóm “Tôi, chúng ta” đồng ý.

## 3. Sửa nội dung

- Toàn bộ chữ Việt – Anh: `assets/js/content.js`. Mỗi mục viết `T('tiếng Việt', 'English')`; mục đổi theo cách xưng hô viết `M('mình – bạn', 'em – thầy', 'English')`.
- Email, Zalo, Formspree, đường dẫn file, tọa độ chữ AN khi chiếu: `assets/js/config.js`.
- Màu, cỡ chữ, bố cục: `assets/css/style.css` (token ở đầu file, theo đúng brief).

## 4. Link cho thầy, chia sẻ, Formspree

- Mã QR cuối video dẫn tới `https://<tên-miền>/?v=thay`: lời chào và câu trả lời ở chương _ AN đổi sang “em – thầy”.
- Link gửi trực tiếp `https://<tên-miền>/` xưng “mình – bạn”. Thêm `?lang=en` để mở bản tiếng Anh.
- Khi có tên miền: trong `index.html`, đổi `og:image` thành `https://<tên-miền>/og-image.png` và điền `og:url`, để link gửi qua Zalo hiện đúng ảnh xem trước. Tạo mã QR từ link có `?v=thay` rồi lưu thành `assets/img/qr-website.png`.
- Chương _ AN gửi chữ người xem chọn về angeladoanminhduyan@gmail.com qua `https://formspree.io/f/xbggrkrl`, tiêu đề “[Portfolio AN] Chữ mới ở chương _ AN: …”. Sau khi đưa lên Vercel, tự ghép thử một chữ và xem cả hộp thư Spam.

## 5. Presentation Mode

Trên laptop: bấm nút **Trình chiếu** hoặc phím **F**.

| Phím | Tác dụng |
|---|---|
| ← → | Chuyển slide |
| P | Bật hoặc tắt biến thể chiếu P1–P9 (nền đen tuyệt đối, ẩn con trỏ) |
| B | Màn đen tuyệt đối, dùng giữa các lượt quay |
| R | Chạy lại hiệu ứng của slide đang chiếu |
| N | Chạy ngay nhịp tiếp theo của hình chiếu, khi thoại nhanh hơn dự kiến |
| Home (đang chiếu) | Về P0: khung trắng làm “đèn phòng” cảnh 1 |
| + / − | Đổi cỡ chữ AN khi chiếu cho vừa lòng bàn tay (lưu cho lần sau) |
| Esc | Thoát về website |

Chữ AN luôn ở 50% ngang, 55% dọc khung 1920×1080. Đổi tọa độ, cỡ chữ mặc định và vùng mắt tối của P2, P7 trong `config.js`, mục `projection`. P9 cuộn website thật trong khung, nên cần chạy qua địa chỉ web (Vercel hoặc máy chủ nội bộ). Nên chạy thử trên máy chiếu thật trước ngày quay.

### Hình chiếu theo “AN – Kịch bản chi tiết & Storyboard Video CV”

Mỗi hình chiếu tự chạy theo nhịp thoại (mốc tính từ lúc chuyển sang slide đó); bấm **N** để chạy nhịp kế tiếp sớm hơn.

| Hình chiếu | Cảnh | Nội dung và nhịp |
|---|---|---|
| P0 | 1 | Khung trắng làm “đèn phòng”; giây 5 chập đèn, giây 7 chập lần hai rồi tắt hẳn. Bấm → sang P1 |
| P1 | 2C | 1 giây đen, rồi AN rơi chậm vào lòng bàn tay, nảy một lần |
| P2 | 3 | Lưới số liệu và màu loang; giây 11 đường xu hướng nối các chấm; giây 15 màu loang nở; giây 18 hai nửa chảy về cằm thành đốm hổ phách rồi tắt |
| P3 | 4 | Chỉ chiếu B và AN (dấu sắc là băng keo thật); giây 3 ảnh sản phẩm trôi; giây 5 và 6 hai thông báo đơn hàng; giây 9 thanh Thấy → Thích → Cân nhắc → Mua; giây 12 nhích nấc Mua |
| P4 | 5 | Chỉ chiếu AN (chữ L là bóng người); giây 4 bình luận trôi vào và tan thành gợn nước; giây 10,5 gợn nước và chấm sáng lan kín tường; giây 12,5 và 14,5 ảnh triển lãm, báo Thanh Niên |
| P5 | 6 | Chiếu AN và G (chữ V vẽ bằng lightstick), sóng âm, đèn sân khấu; giây 3 ô ấn phẩm nảy theo beat; giây 9 tim bay lên |
| P6 | 7 | T, chữ O mặt đồng hồ, AN; giây 3 lưới commplan dừng ở 3 ô; giây 5 · 6,4 · 7,8 điền 2 · 4 · 5; giây 9 đồng hồ về 00:00 và hiện D-Day 26/7; giây 11,5 chữ O rơi khỏi khung |
| P7 | 8 | Tường còn TAN; giây 4,5 hiện “Digital Marketing: A+” và “Trưởng nhóm × 3” |
| P8 | 9 | Chỉ “_ AN” với gạch dưới nhấp nháy (chữ trên đầu ngón tay làm bằng hậu kỳ) |
| P9 | 10B | “_ AN”; giây 2 gạch dưới nở thành mã QR website (cần file `qr-website.png`) |

Màu chiếu từng chương theo kịch bản: cam ấm, xanh nước, hồng neon, trắng lạnh, nâu ấm. Vùng mắt tối ở P2 và P7. Đặt `chinY` trong `config.js` (mặc định 0.7) để đốm hổ phách ở P2 rơi đúng cằm.

## 6. Chạy thử trên máy

Trong thư mục này chạy `python3 -m http.server 8000` rồi mở http://localhost:8000. Mở thẳng `index.html` vẫn xem được, nhưng video, CV, Formspree và P9 cần chạy qua máy chủ.

## 7. Ghi chú kỹ thuật

- Font Playfair Display, Be Vietnam Pro, Space Mono tải từ Google Fonts, đều có dấu tiếng Việt.
- Chữ AN 3D dựng bằng CSS (14 lớp xếp chiều sâu, xoay tối đa 15° theo chuột, vệt sáng quét qua), chỉ bật trên desktop; điện thoại dùng bản phẳng có vệt sáng lặp. Nếu sau này có file Spline, thay phần dựng trong hàm `build3D` ở `main.js`.
- Hiệu ứng viết bằng JavaScript thuần (Web Animations API), không cần GSAP. Máy bật chế độ giảm chuyển động thì mọi chuyển động lớn đổi thành mờ dần 200 ms.
- Ảnh sản phẩm Shopee lấy trực tiếp từ link ở cột “Link ảnh lớn” trong portfolio.
- `favicon.svg` và `og-image.png` vẽ chữ AN bằng một kiểu chữ serif tương tự; có thể thay bằng bản xuất từ Canva cùng tên, kích thước 1200×630.

## 8. Nghiệm thu (theo brief)

- [ ] Màn đầu hiện trong 3 giây trên điện thoại dùng 4G
- [ ] Từ màn bất kỳ, tới nút Tải CV trong tối đa 2 lần bấm
- [ ] 5 từ mẫu ở chương _ AN ra đúng câu trả lời; chữ lạ ra câu dự phòng
- [ ] Chữ gõ ở chương _ AN về tới email
- [ ] Tham số ?v=thay đổi đúng cách xưng hô
- [ ] Mọi link minh chứng mở được khi chưa đăng nhập (kiểm tra quyền Google Drive của video Bean Cafe)
- [ ] Song ngữ đủ ở mọi màn, kể cả phụ đề video
- [ ] Presentation Mode chạy toàn màn hình 1080p trên máy chiếu; phím F, P, B, Esc hoạt động
- [ ] Bật chế độ giảm chuyển động: trang vẫn dùng được, không còn chuyển động lớn
- [ ] Gửi thử link qua Zalo: ảnh xem trước hiện đúng
- [ ] Màn Phụ lục có đủ ba tiêu chí của thầy, mỗi cột đọc được trong 30 giây
