/* =========================================================================
   AN · cấu hình
   Website tự kiểm tra file khi chạy trên Vercel: đặt đúng tên file vào đúng
   thư mục là nội dung tự hiện, khung “thay sau” tự biến mất. Chỉ sửa file này
   khi muốn đổi tên hoặc đường dẫn.
   Ảnh nhận đuôi .webp, .jpg, .jpeg hoặc .png (ưu tiên .webp, rộng tối đa 1600 px).
   ========================================================================= */
window.AN_CONFIG = {
  formspree: 'https://formspree.io/f/xbggrkrl',
  email: 'angeladoanminhduyan@gmail.com',
  zalo: '0888811311',

  // Tên miền đầy đủ khi có, ví dụ 'https://an-portfolio.vercel.app'
  siteUrl: 'https://an-portfolio-pi.vercel.app',

  images: {
    evidence: 'assets/img/evidence/',   // 1-1 … 1-7, 2-1 … 2-5, 3-1 … 3-4, 4-1 … 4-6, tan-1 … tan-4
    portrait: 'assets/img/portrait',    // ảnh chân dung tỷ lệ 4:5
    qrCv: 'assets/img/qr-cv-public',           // mã QR quét để xem CV (màn Liên hệ, slide 9)
    qr: 'assets/img/qr-website',        // mã QR dẫn về website
    covers: 'assets/img/projects/'      // ảnh bìa đồ án: imc, dmkt
  },

  video: {
    // Mỗi mục: file .mp4 (H.264) và .webm cùng tên; phụ đề .vi.vtt và .en.vtt cùng tên
    hero: 'assets/video/hero-loop',       // video nền màn mở đầu, 8–12 giây, tối đa 4 MB
    cv: 'assets/video/video-cv',          // video CV bản đầy đủ
    cutdowns: {                           // 5 clip 10–15 giây, 720p, tối đa 3 MB mỗi clip
      ban: 'assets/video/cutdown-ban',
      lan: 'assets/video/cutdown-lan',
      vang: 'assets/video/cutdown-vang',
      toan: 'assets/video/cutdown-toan',
      tan: 'assets/video/cutdown-tan'
    }
  },

  // CV trên Google Docs: khi chưa có file PDF trong assets/cv/, nút Tải CV tải PDF xuất trực tiếp từ đây
  cvLink: {
    vi: 'https://docs.google.com/document/d/16luBtcATUan5DWwoy1oNXAex9RAKNYK6ylWwuQuANXE/export?format=pdf',
    en: 'https://docs.google.com/document/d/17Ov5HweAwzHO7zZL-vjjh9fTOyW0dAc0XdvLYPTFh2I/export?format=pdf'
  },

  cv: {
    vi: 'assets/cv/DoanMinhDuyAn_CV.pdf',
    en: 'assets/cv/DoanMinhDuyAn_CV_EN.pdf'
  },

  // Biến thể chiếu (Presentation Mode, phím P)
  projection: {
    anX: 0.5,            // tọa độ tâm chữ AN theo chiều ngang (0–1)
    anY: 0.55,           // tọa độ tâm chữ AN theo chiều dọc (0–1)
    anSize: 180,         // cỡ chữ AN trên khung 1920×1080; chỉnh nhanh bằng phím + và −
    eyeTop: 0.16,        // vùng mắt tối ở P2 và P7, tính theo chiều cao khung
    eyeBottom: 0.36,
    chinY: 0.7            // vị trí cằm ở P2 (đốm hổ phách), tính theo chiều cao khung
  }
};
