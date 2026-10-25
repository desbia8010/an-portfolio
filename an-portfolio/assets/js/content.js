/* =========================================================================
   AN · nội dung song ngữ
   Sửa chữ ở file này. Mỗi mục viết dạng T('tiếng Việt', 'English').
   Mục đổi theo cách xưng hô viết dạng M('bản mình – bạn', 'bản em – thầy', 'English').
   Bản em – thầy hiện khi link có ?v=thay (mã QR cuối video).
   ========================================================================= */
(function () {
  const T = (vi, en) => ({ vi, en });
  const M = (ban, thay, en) => ({ vi: { ban, thay }, en });
  const SHOPEE_IMG = 'https://down-vn.img.susercontent.com/file/';

  window.AN_CONTENT = {
    ui: {
      skip: T('Bỏ qua, tới mục lục', 'Skip to contents'),
      home: T('AN, về đầu trang', 'AN, back to top'),
      toc: T('Mục lục', 'Contents'),
      appendix: T('Phụ lục', 'Appendix'),
      contact: T('Liên hệ', 'Contact'),
      cv: T('Tải CV', 'Download CV'),
      present: T('Trình chiếu', 'Present'),
      soundOn: T('Bật âm thanh', 'Turn sound on'),
      soundOff: T('Tắt âm thanh', 'Turn sound off'),
      menu: T('Mở menu', 'Open menu'),
      close: T('Đóng', 'Close'),
      chapters: T('Các chương', 'Chapters'),
      chapterOf: T('Chương {n}/5', 'Chapter {n}/5'),
      chapterN: T('Chương {n}', 'Chapter {n}'),
      screens: {
        an: T('Mở đầu', 'Opening'),
        'muc-luc': T('Mục lục', 'Contents'),
        'phu-luc': T('Phụ lục', 'Appendix'),
        'chuong-tiep': T('Chương _ AN', 'Chapter _ AN'),
        'lien-he': T('Liên hệ', 'Contact')
      },
      ph: T('thay sau', 'replace later'),
      notesBtn: T('Ghi chú của người viết', 'Writer’s notes'),
      back: T('← Quay lại truyện', '← Back to the story'),
      nextChapter: T('Chương tiếp →', 'Next chapter →'),
      toAppendix: T('Phụ lục →', 'Appendix →'),
      evidence: T('Minh chứng', 'Evidence'),
      clip: T('Cutdown 10–15 giây', '10–15 s cutdown'),
      more: T('+{n} ảnh', '+{n} photos'),
      prev: T('Ảnh trước', 'Previous'),
      next: T('Ảnh sau', 'Next'),
      copied: T('Đã sao chép', 'Copied'),
      cvMissing: T('File CV PDF · thay sau', 'CV PDF · replace later'),
      slideMissing: T('Slide đồ án · thay sau', 'Project slides · replace later'),
      lang: T('Đổi ngôn ngữ', 'Switch language'),
      heads: {
        context: T('Bối cảnh', 'Context'),
        role: T('Vai trò', 'Role'),
        insight: T('Insight', 'Insight'),
        execution: T('Triển khai', 'Execution')
      },
      browserLabel: T('Đồ án cuối kì · Phát triển website căn bản', 'Final project · Web Development Fundamentals'),
      play: T('Phát video', 'Play video'),
      noscript: T('Website cần JavaScript để hiển thị đầy đủ.', 'This site needs JavaScript to display fully.')
    },

    hero: {
      greet: M(
        'Chào bạn. Ánh sáng bạn vừa thấy bắt đầu từ đây.',
        'Em chào thầy. Ánh sáng thầy vừa thấy bắt đầu từ đây.',
        'Hello. The light you just saw starts here.'
      ),
      sub: T('Một series về An. Cảm hứng từ một chapter năm 2022.', 'A series about An. Inspired by a 2022 chapter.'),
      watch: T('Xem video CV', 'Watch the CV video'),
      read: T('Đọc từng chương ↓', 'Read chapter by chapter ↓'),
      bgPh: T('Video nền 8–12 giây', 'Background video, 8–12 s'),
      videoTitle: T('Video CV', 'CV video'),
      videoPh: T('Video CV bản đầy đủ, phụ đề Việt và Anh', 'Full CV video, Vietnamese and English subtitles')
    },

    toc: {
      title: T('Mục lục', 'Contents'),
      lead: T('Năm chương, chữ nào cũng có An ở trong.', 'Five chapters, and An is inside every one.'),
      opening: { num: T('Mở đầu', 'Opening'), name: T('Bản thân', 'About me') },
      next: { num: T('Chương tiếp', 'Next chapter'), name: T('Người xem', 'You, the viewer') }
    },

    chapters: [
      /* ---------------------------------------------------------------- B·ÁN */
      {
        id: 'ban', n: 1, pre: 'B', an: 'ÁN', post: '', dotted: 'B·ÁN', rail: 'BÁN',
        project: T('Shopee và đồ án Bean Cafe', 'Shopee and the Bean Cafe project'),
        story: T(
          'Mình bắt đầu bằng bản năng: tự viết mô tả, tự đăng từng hộp Lucky Box, rồi hồi hộp chờ từng đơn hàng.',
          'I started on instinct: writing every description, listing each Lucky Box myself, then waiting anxiously for every order.'
        ),
        notes: {
          context: T(
            'Gian hàng Shopee do mình tự vận hành, từ đơn đầu tiên ngày 31/01/2025, với hai dòng hàng: Lucky Box và card/merch Sakamoto Days. Song song, mình dựng website bán hàng Bean Cafe cho đồ án cuối kì môn Phát triển website căn bản.',
            'A Shopee shop I run myself, from its first order on 31/01/2025, with two product lines: Lucky Boxes and Sakamoto Days cards/merch. Alongside it, I built the Bean Cafe sales website as the final project for Web Development Fundamentals.'
          ),
          role: T(
            'Vận hành gian hàng: tự viết mô tả và tự đăng sản phẩm. Dựng website Bean Cafe trong đồ án môn học.',
            'Running the shop: writing the descriptions and listing the products myself. Building the Bean Cafe website for a course project.'
          ),
          insight: T(
            'Người mua Lucky Box trả tiền cho cảm giác bất ngờ và cảm giác “hời”, nhưng thứ khiến họ quay lại là món đồ đến tay còn nguyên vẹn.',
            'Lucky Box buyers pay for the surprise and the feeling of a bargain, but what brings them back is an item that arrives intact.'
          ),
          insightSrc: T(
            'Rút từ số liệu: Lucky Box chiếm 133/152 sản phẩm đã bán; đánh giá nhắc “siêu hời”, “card ko bị cong”.',
            'Drawn from the data: Lucky Boxes are 133 of 152 items sold; reviews say “siêu hời” (a real steal) and “card ko bị cong” (cards not bent).'
          ),
          execution: T(
            'Chia gian hàng thành hai dòng: Lucky Box (Sakamoto Days, Kinh Phong, Cortis) và card/merch Sakamoto Days. Website Bean Cafe là đồ án cuối kì; video ghi màn hình nằm trong phần minh chứng.',
            'Split the shop into two lines: Lucky Boxes (Sakamoto Days, Kinh Phong, Cortis) and Sakamoto Days cards/merch. Bean Cafe is a final course project; its screen recording is in the evidence.'
          ),
          resultsHead: T('Kết quả', 'Results'),
          results: [
            T('Điểm đánh giá shop 4.7/5 từ 40 lượt đánh giá.', 'Shop rating 4.7/5 from 40 reviews.'),
            T('111 đơn ở trạng thái “Đã giao” (Kênh Người Bán không có nhãn “Hoàn thành”).', '111 orders marked “Delivered” (Seller Centre has no “Completed” label).'),
            T('152 sản phẩm đã bán theo cột “Doanh số” trong Kênh Người Bán: Lucky Box 133, card/merch Sakamoto Days 19.', '152 items sold per the “Sales” column in Seller Centre: Lucky Box 133, Sakamoto Days cards/merch 19.'),
            T('Thời gian bán: đơn đầu tiên 31/01/2025, đơn gần nhất 22/10/2026.', 'Selling period: first order 31/01/2025, latest order 22/10/2026.')
          ],
          resultsDate: T('Ghi nhận 22/10/2026', 'Recorded 22/10/2026')
        },
        links: [
          { label: T('Gian hàng Shopee', 'Shopee shop'), href: 'https://shopee.vn/d3nbzlkuwo' },
          { label: T('Video Bean Cafe', 'Bean Cafe video'), href: 'https://drive.google.com/file/d/1F_jwypASH3CMqO90rfFEMQMhqdcwBonB/view?usp=sharing' }
        ],
        gallery: [
          { file: '4-1', fig: T('Hình 4.1', 'Fig. 4.1'), cap: T('Hình 4.1 · Phần đầu trang shop goodanimez: đánh giá 4.7 (40 đánh giá), tham gia 23 tháng trước. Chụp 22/10/2026.', 'Fig. 4.1 · Shop header (goodanimez): 4.7 rating (40 reviews), joined 23 months ago. Captured 22/10/2026.') },
          { file: '4-2', fig: T('Hình 4.2', 'Fig. 4.2'), cap: T('Hình 4.2 · Lưới sản phẩm dòng Lucky Box trên trang shop. Chụp 22/10/2026.', 'Fig. 4.2 · Lucky Box product grid on the shop page. Captured 22/10/2026.') },
          { file: '4-3', fig: T('Hình 4.3', 'Fig. 4.3'), cap: T('Hình 4.3 · Danh sách sản phẩm dòng card/merch Sakamoto Days trong Kênh Người Bán. Chụp 22/10/2026.', 'Fig. 4.3 · Sakamoto Days cards/merch listings in Seller Centre. Captured 22/10/2026.') },
          { file: '4-4', fig: T('Hình 4.4', 'Fig. 4.4'), cap: T('Hình 4.4 · Phần Đánh giá Shop với phân bố sao; tên và ảnh đại diện người mua đã được làm mờ. Chụp 22/10/2026.', 'Fig. 4.4 · Shop reviews with the star distribution; buyer names and avatars blurred. Captured 22/10/2026.') },
          { file: '4-5', fig: T('Hình 4.5', 'Fig. 4.5'), cap: T('Hình 4.5 · Danh sách đơn “Đã giao” trong Kênh Người Bán; thông tin người mua và mã vận đơn đã được làm mờ. Chụp 22/10/2026.', 'Fig. 4.5 · “Delivered” orders in Seller Centre; buyer details and tracking codes blurred. Captured 22/10/2026.') },
          { file: '4-6', fig: T('Hình 4.6', 'Fig. 4.6'), cap: T('Hình 4.6 · Phân tích bán hàng, tổng quan theo năm 2026. Chụp 22/10/2026.', 'Fig. 4.6 · Sales analytics, 2026 yearly overview. Captured 22/10/2026.') },
          { src: SHOPEE_IMG + 'vn-11134207-7ras8-m3yxjh9fb8modb', cap: T('LUCKY BOX SAKAMOTO DAYS · 50.000₫', 'LUCKY BOX SAKAMOTO DAYS · 50,000₫') },
          { src: SHOPEE_IMG + 'vn-11134207-81ztc-mo40iql3sw043b', cap: T('LUCKY BOX KINH PHONG (Tôi phong thần trong trò chơi vô hạn) · 50.000₫', 'LUCKY BOX KINH PHONG · 50,000₫') },
          { src: SHOPEE_IMG + 'vn-11134207-81ztc-mrx4kogzmt51c0', cap: T('LUCKY BOX CORTIS · 15.000₫ (giá gốc 20.000₫)', 'LUCKY BOX CORTIS · 15,000₫ (was 20,000₫)') },
          { src: SHOPEE_IMG + 'vn-11134207-7ras8-m3yxf9vqu6pc04', cap: T('CARD NAGUMO (Sakamoto Days) chính hãng · 110.000₫', 'CARD NAGUMO (Sakamoto Days), official · 110,000₫') },
          { src: SHOPEE_IMG + 'vn-11134207-7ras8-m5whkk0asszceb', cap: T('CARD WAFER SPECIAL NAGUMO (Sakamoto Days) · 200.000₫', 'CARD WAFER SPECIAL NAGUMO (Sakamoto Days) · 200,000₫') },
          { src: SHOPEE_IMG + 'vn-11134207-7ras8-m3yxf9vqvl9sac', cap: T('STANDEE NAGUMO + Lu (Sakamoto Days) · 180.000₫', 'STANDEE NAGUMO + Lu (Sakamoto Days) · 180,000₫') },
          { drive: '1F_jwypASH3CMqO90rfFEMQMhqdcwBonB', cap: T('Website Bean Cafe · Đồ án cuối kì · Phát triển website căn bản', 'Bean Cafe website · Final project · Web Development Fundamentals') }
        ],
        strip: [0, 6, 3, 12],
        slide: { stat: T('152', '152'), statLabel: T('sản phẩm đã bán · Kênh Người Bán, ghi nhận 22/10/2026', 'items sold · Seller Centre, recorded 22/10/2026'), img: 6 }
      },

      /* ---------------------------------------------------------------- L·AN */
      {
        id: 'lan', n: 2, pre: 'L', an: 'AN', post: '', dotted: 'L·AN', rail: 'LAN',
        project: T('Tôi, chúng ta', 'Tôi, chúng ta'),
        story: T(
          'Ở “Tôi, chúng ta”, mình học cách lắng nghe trước khi lên tiếng.',
          'At “Tôi, chúng ta”, I learned to listen before speaking up.'
        ),
        notes: {
          context: T(
            'Dự án phi lợi nhuận do nhóm học sinh THPT tại TP.HCM thành lập tháng 8/2021, truyền thông về sức khỏe tinh thần, bình đẳng giới, cộng đồng LGBTQIA+ và gia đình.',
            'A non-profit project founded in August 2021 by a group of high-school students in Ho Chi Minh City, communicating about mental health, gender equality, the LGBTQIA+ community and family.'
          ),
          role: T(
            'Content creator và media từ khi page mới thành lập (2021) đến năm 2024.',
            'Content creator and media from the page’s founding in 2021 until 2024.'
          ),
          insight: T(
            'Người trẻ khó nói thẳng về sức khỏe tinh thần, nhưng sẵn sàng kể qua một bức vẽ.',
            'Young people find it hard to talk about mental health directly, but they are willing to tell it through a drawing.'
          ),
          insightSrc: T(
            'Rút từ số liệu: bài công bố cuộc thi vẽ “Lặng” có 198 bình luận, 128 chia sẻ.',
            'Drawn from the data: the post announcing the “Lặng” drawing contest drew 198 comments and 128 shares.'
          ),
          execution: T(
            'Cùng ê-kíp sản xuất các series nội dung về sức khỏe tinh thần, như series “TRẦM”, và truyền thông cho chuỗi sự kiện “Lặng”: cuộc thi vẽ (công bố 6/7/2022) và triển lãm tại Ngõ Art Gallery, Thảo Điền (1–7/8/2022).',
            'With the team, produced mental-health content series such as “TRẦM”, and promoted the “Lặng” event series: a drawing contest (announced 6/7/2022) and an exhibition at Ngõ Art Gallery, Thảo Điền (1–7/8/2022).'
          ),
          resultsHead: T('Kết quả chung của ê-kíp', 'Team results'),
          results: [
            T('Fanpage khoảng 8.400 người theo dõi (ghi nhận 7/10/2026).', 'Fanpage with about 8,400 followers (recorded 7/10/2026).'),
            T('Bài công bố cuộc thi “Lặng”: 883 lượt thích, 198 bình luận, 128 chia sẻ.', '“Lặng” contest announcement: 883 likes, 198 comments, 128 shares.'),
            T('Triển lãm: 16 tác phẩm, khoảng 70–80 khách mỗi ngày, 70% doanh thu gây quỹ.', 'Exhibition: 16 works, about 70–80 visitors a day, 70% of revenue raised for the fund.'),
            T('Báo Thanh Niên đưa tin ngày 7/8/2022.', 'Covered by Thanh Niên newspaper on 7/8/2022.')
          ],
          resultsDate: null
        },
        links: [
          { label: T('Fanpage', 'Fanpage'), href: 'https://www.facebook.com/toichungtaproject' },
          { label: T('Bài “TRẦM” Chapter 3', '“TRẦM” Chapter 3 post'), href: 'https://www.facebook.com/toichungtaproject/posts/pfbid02y8kFdJYA1gQZ7EVUKdBJLP6EvQycHyCbEDdTDsuxk5hLmJe6SicqJHxxDUcNREQ6l' },
          { label: T('Báo Thanh Niên', 'Thanh Niên article'), href: 'https://thanhnien.vn/tim-den-su-binh-yen-trong-tam-hon-qua-buc-ve-1851485832.htm' },
          { label: T('Linktree dự án', 'Project Linktree'), href: 'https://linktr.ee/toichungta' }
        ],
        gallery: [
          { file: '1-1', fig: T('Hình 1.1', 'Fig. 1.1'), cap: T('Hình 1.1 · Fanpage Tôi, chúng ta: khoảng 8,4K người theo dõi, Tổ chức phi chính phủ (NGO). Chụp 7/10/2026.', 'Fig. 1.1 · Tôi, chúng ta fanpage: about 8.4K followers, listed as an NGO. Captured 7/10/2026.') },
          { file: '1-2', fig: T('Hình 1.2', 'Fig. 1.2'), cap: T('Hình 1.2 · Mục Giới thiệu của page: “Tôi, chúng ta” được thành lập tháng 8/2021 tại TP.HCM. Chụp 7/10/2026.', 'Fig. 1.2 · The page’s About section: “Tôi, chúng ta” was founded in August 2021 in Ho Chi Minh City. Captured 7/10/2026.') },
          { file: '1-3', fig: T('Hình 1.3', 'Fig. 1.3'), cap: T('Hình 1.3 · Bài mở chuỗi sự kiện “Lặng”, poster cuộc thi vẽ (6/7/2022): 883 lượt thích, 198 bình luận, 128 chia sẻ.', 'Fig. 1.3 · The post opening the “Lặng” series, drawing-contest poster (6/7/2022): 883 likes, 198 comments, 128 shares.') },
          { file: '1-4', fig: T('Hình 1.4', 'Fig. 1.4'), cap: T('Hình 1.4 · Bài recap triển lãm “Lặng” tại Ngõ Art Gallery, đăng 8/8/2022.', 'Fig. 1.4 · Recap post of the “Lặng” exhibition at Ngõ Art Gallery, posted 8/8/2022.') },
          { file: '1-5', fig: T('Hình 1.5', 'Fig. 1.5'), cap: T('Hình 1.5 · Ấn phẩm công bố Top 3 tác phẩm đoạt giải cuộc thi vẽ “Lặng”, đăng 9/8/2022.', 'Fig. 1.5 · Visual announcing the Top 3 winning works of the “Lặng” contest, posted 9/8/2022.') },
          { file: '1-6', fig: T('Hình 1.6', 'Fig. 1.6'), cap: T('Hình 1.6 · Series “TRẦM” Chapter 3: An – Bình yên từ những điều giản đơn, đăng 14/11/2022.', 'Fig. 1.6 · “TRẦM” series, Chapter 3: An – Peace in simple things, posted 14/11/2022.') },
          { file: '1-7', fig: T('Hình 1.7', 'Fig. 1.7'), cap: T('Hình 1.7 · Báo Thanh Niên 07/08/2022 nhắc đến cuộc thi tranh “Lặng” của dự án “Tôi, chúng ta”.', 'Fig. 1.7 · Thanh Niên newspaper, 07/08/2022, mentioning the “Lặng” drawing contest by “Tôi, chúng ta”.') }
        ],
        strip: [0, 2, 5, 6],
        slide: { stat: T('<small>khoảng</small> 8.400', '<small>about</small> 8,400'), statLabel: T('người theo dõi fanpage · kết quả chung của ê-kíp, ghi nhận 7/10/2026', 'fanpage followers · team result, recorded 7/10/2026'), img: 2 }
      },

      /* -------------------------------------------------------------- V·AN·G */
      {
        id: 'vang', n: 3, pre: 'V', an: 'AN', post: 'G', dotted: 'V·AN·G', rail: 'VANG',
        project: T('Tuổi Hồng 27', 'Tuổi Hồng 27'),
        story: T(
          'Giữa ê-kíp Tuổi Hồng, mình học cách để từng ấn phẩm góp vào một tiếng vang chung.',
          'Inside the Tuổi Hồng crew, I learned to make every piece add to one shared resonance.'
        ),
        notes: {
          context: T(
            'Tuổi Hồng là nhạc hội thường niên của Trường THPT Nguyễn Thị Minh Khai (TP.HCM), tổ chức để gây quỹ cho các hoạt động từ thiện. Mùa 27 mang tên “Luv FeZta” (2022).',
            'Tuổi Hồng is the annual music festival of Nguyễn Thị Minh Khai High School (Ho Chi Minh City), held to raise funds for charity. Season 27 was called “Luv FeZta” (2022).'
          ),
          role: T(
            'Thành viên ban Media mùa 27: sản xuất ấn phẩm truyền thông cho chiến dịch trước, trong và sau đêm nhạc hội.',
            'Member of the Season 27 Media team, producing campaign visuals before, during and after the festival night.'
          ),
          insight: T(
            'Với nhạc hội học đường, người xem tương tác với con người nhiều hơn với thiết kế: gương mặt quen thuộc kéo tương tác mạnh hơn một key visual đẹp.',
            'At a school music festival, people engage with people more than with design: familiar faces pull more engagement than a beautiful key visual.'
          ),
          insightSrc: T(
            'Rút từ số liệu: line-up MC 1,7K lượt thích so với key visual 1,5K.',
            'Drawn from the data: the MC line-up got 1.7K likes versus 1.5K for the key visual.'
          ),
          execution: T(
            'Cùng ban Media thực hiện ấn phẩm cho chiến dịch: key visual, line-up, tri ân nhà tài trợ và nội dung hình ảnh đêm diễn. Chiến dịch kéo dài từ tháng 8 đến 9/2022, khép lại bằng bài tri ân nhà tài trợ ngày 22/9/2022.',
            'With the Media team, produced the campaign visuals: key visual, line-up, sponsor thank-you and photo content from the night. The campaign ran from August to September 2022 and closed with the sponsor thank-you post on 22/9/2022.'
          ),
          resultsHead: T('Kết quả chung của ban Media', 'Media team results'),
          results: [
            T('Key visual “Luv FeZta”: 1,5K lượt thích, 227 bình luận, 44 chia sẻ.', '“Luv FeZta” key visual: 1.5K likes, 227 comments, 44 shares.'),
            T('Ấn phẩm line-up MC: 1,7K lượt thích.', 'MC line-up visual: 1.7K likes.'),
            T('Chiến dịch tháng 8–9/2022.', 'Campaign: August–September 2022.'),
            T('Fanpage khoảng 65.000 người theo dõi (ghi nhận 7/10/2026).', 'Fanpage with about 65,000 followers (recorded 7/10/2026).')
          ],
          resultsDate: null
        },
        links: [
          { label: T('Fanpage Tuổi Hồng', 'Tuổi Hồng fanpage'), href: 'https://www.facebook.com/tuoihongmiki' },
          { label: T('TikTok @tuoihongmiki', 'TikTok @tuoihongmiki'), href: 'https://www.tiktok.com/@tuoihongmiki' }
        ],
        gallery: [
          { file: '2-1', fig: T('Hình 2.1', 'Fig. 2.1'), cap: T('Hình 2.1 · Fanpage Tuổi Hồng Minh Khai: 65K người theo dõi. Chụp 7/10/2026.', 'Fig. 2.1 · Tuổi Hồng Minh Khai fanpage: 65K followers. Captured 7/10/2026.') },
          { file: '2-2', fig: T('Hình 2.2', 'Fig. 2.2'), cap: T('Hình 2.2 · Key visual mùa 27 “Luv FeZta”, đăng 7/8/2022: 1,5K lượt thích, 227 bình luận, 44 chia sẻ.', 'Fig. 2.2 · Season 27 key visual “Luv FeZta”, posted 7/8/2022: 1.5K likes, 227 comments, 44 shares.') },
          { file: '2-3', fig: T('Hình 2.3', 'Fig. 2.3'), cap: T('Hình 2.3 · Ấn phẩm line-up MC trong album #tuoihong27 LINE-UP! (2022), đăng 24/8/2022: 1,7K lượt thích.', 'Fig. 2.3 · MC line-up visual in the #tuoihong27 LINE-UP! album (2022), posted 24/8/2022: 1.7K likes.') },
          { file: '2-4', fig: T('Hình 2.4', 'Fig. 2.4'), cap: T('Hình 2.4 · Bài hình ảnh đêm nhạc hội, chia sẻ album “[2022] TUỔI HỒNG 27 – LUV FEZTA”, đăng 13/9/2022.', 'Fig. 2.4 · Photo post from the festival night, sharing the album “[2022] TUỔI HỒNG 27 – LUV FEZTA”, posted 13/9/2022.') },
          { file: '2-5', fig: T('Hình 2.5', 'Fig. 2.5'), cap: T('Hình 2.5 · Ấn phẩm “Tri ân nhà tài trợ” khép lại mùa 27, đăng 22/9/2022.', 'Fig. 2.5 · “Thank you, sponsors” visual closing Season 27, posted 22/9/2022.') }
        ],
        strip: [1, 2, 3, 4],
        slide: { stat: T('1,7K', '1.7K'), statLabel: T('lượt thích ấn phẩm line-up MC · kết quả chung của ban Media', 'likes on the MC line-up visual · Media team result'), img: 1 }
      },

      /* --------------------------------------------------------------- TO·AN */
      {
        id: 'toan', n: 4, pre: 'TO', an: 'AN', post: '', dotted: 'TO·AN', rail: 'TOAN',
        project: T('idX 2025', 'idX 2025'),
        story: T(
          'Ở idX, mình lo toan từng ô trong commplan để mọi thứ về đích đúng D-Day.',
          'At idX, I took care of every cell in the commplan so that everything crossed the line on D-Day.'
        ),
        notes: {
          context: T(
            'idX 2025 là cuộc thi định hướng nghề nghiệp với career exposure, mentorship và giải thưởng cho ba mảng Business, Tech, Creative Industry. idX nhắm tới du học sinh tại Queensland (theo hashtag #avsq, #brisbane trong commplan).',
            'idX 2025 is a career-orientation competition offering career exposure, mentorship and prizes across Business, Tech and Creative Industry. It targets international students in Queensland (per the #avsq and #brisbane hashtags in the commplan).'
          ),
          role: T(
            'Thành viên ban Marketing kiêm PR, phụ trách commplan và timeline tổng cho toàn dự án.',
            'Marketing team member and PR, in charge of the commplan and the master timeline for the whole project.'
          ),
          insight: T(
            'Sinh viên năm cuối nộp hàng chục đơn mà không được hồi âm, và chỗ thực tập nào cũng đòi kinh nghiệm họ chưa thể có. Họ không thiếu cố gắng, họ thiếu một nơi gặp đúng nhà tuyển dụng.',
            'Final-year students send dozens of applications with no reply, and every internship asks for experience they cannot have yet. They don’t lack effort; they lack a place to meet the right employers.'
          ),
          insightSrc: T(
            'Nguồn: content calendar idX, các pitch “Feel lost for your career?”, “Apply for 50+ roles → ghosted by 51”, “they ask for 3 years of experience”, và USP của Observer Campaign.',
            'Source: the idX content calendar, pitches such as “Feel lost for your career?”, “Apply for 50+ roles → ghosted by 51”, “they ask for 3 years of experience”, and the Observer Campaign USP.'
          ),
          execution: T(
            'Bảng Overview điều phối 5 mảng: Social media, Stakeholders’ communication, Seeding, Email marketing, Branding items, mỗi đầu việc có deadline, PIC và Status. Mỗi mảng đi theo quy trình draft → final → triển khai, ví dụ Marketing brief (12/3) → Campaign plan (20/3) → Commplan draft (4/4) → final (7/4) → chạy campaign (14/4). Kèm 4 content calendar cho Facebook, Instagram và TikTok.',
            'An Overview board coordinating 5 workstreams (Social media, Stakeholders’ communication, Seeding, Email marketing, Branding items), each task with a deadline, PIC and status. Every workstream went draft → final → launch, e.g. Marketing brief (12/3) → Campaign plan (20/3) → Commplan draft (4/4) → final (7/4) → campaign live (14/4). Plus 4 content calendars for Facebook, Instagram and TikTok.'
          ),
          resultsHead: T('Kết quả', 'Results'),
          results: [
            T('2 chiến dịch: Contestant 14/4–25/5 và Observer 9/6–27/7.', '2 campaigns: Contestant 14/4–25/5 and Observer 9/6–27/7.'),
            T('4 content calendar.', '4 content calendars.'),
            T('5 mảng việc.', '5 workstreams.'),
            T('D-Day 26/7/2025.', 'D-Day 26/7/2025.')
          ],
          resultsDate: null
        },
        links: [],
        linksNote: T('Minh chứng: Hình 3.1–3.4, tên thành viên đã được làm mờ.', 'Evidence: Figs. 3.1–3.4, member names blurred.'),
        gallery: [
          { file: '3-1', fig: T('Hình 3.1', 'Fig. 3.1'), cap: T('Hình 3.1 · Tab Overview: mốc Contestant/Observer Campaign, Trial Run, D-Day; chuỗi Marketing brief → Commplan draft → final với PIC và Status DONE. Tên thành viên đã được làm mờ.', 'Fig. 3.1 · Overview tab: Contestant/Observer Campaign, Trial Run and D-Day milestones; Marketing brief → Commplan draft → final with PIC and Status DONE. Member names blurred.') },
          { file: '3-2', fig: T('Hình 3.2', 'Fig. 3.2'), cap: T('Hình 3.2 · Tab Overview: Seeding, Email marketing, Branding items. Tên thành viên đã được làm mờ.', 'Fig. 3.2 · Overview tab: Seeding, Email marketing, Branding items. Member names blurred.') },
          { file: '3-3', fig: T('Hình 3.3', 'Fig. 3.3'), cap: T('Hình 3.3 · Tab [Contestant] FB&INS: chuỗi bài 14/4–1/5 Contestant Recruitment với Draft due, Post date, Pitch, Pillar, Format, Hashtags.', 'Fig. 3.3 · [Contestant] FB&INS tab: the 14/4–1/5 Contestant Recruitment posts with Draft due, Post date, Pitch, Pillar, Format, Hashtags.') },
          { file: '3-4', fig: T('Hình 3.4', 'Fig. 3.4'), cap: T('Hình 3.4 · Tab [Contestant] TikTok: lịch đăng video 12/4–18/4 với Pitch, Pillar (Promotion / Fun + Promo), chi tiết kịch bản và Format.', 'Fig. 3.4 · [Contestant] TikTok tab: video schedule 12/4–18/4 with Pitch, Pillar (Promotion / Fun + Promo), script details and Format.') }
        ],
        strip: [0, 1, 2, 3],
        slide: { stat: T('4', '4'), statLabel: T('content calendar · 2 chiến dịch · 5 mảng việc · D-Day 26/7/2025', 'content calendars · 2 campaigns · 5 workstreams · D-Day 26/7/2025'), img: 0 }
      },

      /* ---------------------------------------------------------------- T·AN */
      {
        id: 'tan', n: 5, pre: 'T', an: 'AN', post: '', dotted: 'T·AN', rail: 'TAN',
        project: T('Đồ án IMC G7 – Open Spirit', 'IMC coursework: G7 – Open Spirit'),
        story: T(
          'Ở Văn Lang và CLB Ong Sáng Tạo, mình đi từ bản năng sang chiến lược; rõ nhất là đồ án IMC cho G7 mình làm trưởng nhóm, nơi chiến lược tan vào đời sống người dùng.',
          'At Văn Lang and the Ong Sáng Tạo club, I moved from instinct to strategy, most clearly in the G7 IMC coursework I led, where strategy dissolves into everyday life.'
        ),
        notes: {
          context: T(
            'Đồ án môn Kế hoạch truyền thông tích hợp (mã lớp học phần 251_71MRKT40123_01), nhóm 8 gồm 11 thành viên: chiến dịch “G7 – Open Spirit” cho Trung Nguyên Legend. Mục tiêu, KPI và ngân sách là số kế hoạch của đồ án môn học, không phải chiến dịch chính thức của G7.',
            'Coursework for Integrated Marketing Communications Planning (class code 251_71MRKT40123_01), group 8 with 11 members: the “G7 – Open Spirit” campaign for Trung Nguyên Legend. Objectives, KPIs and budget are the coursework’s planned figures, not an official G7 campaign.'
          ),
          role: T('Trưởng nhóm.', 'Team leader.'),
          insight: T(
            '“Tôi cần một sản phẩm cà phê vừa nhanh – tiện – chuẩn vị cà phê, vừa mang lại trải nghiệm trẻ trung, hợp xu hướng để giúp tôi duy trì năng lượng và thể hiện phong cách sống hiện đại.” Tension: nhiều sản phẩm giống nhau, mua online dễ thất vọng.',
            '“I need a coffee product that is fast, convenient and true to coffee taste, while giving me a young, on-trend experience that keeps my energy up and shows a modern lifestyle.” Tension: many products look alike, and buying online often disappoints.'
          ),
          insightSrc: T(
            'Nguyên văn từ slide đồ án “IMC01-Nhom8”, phần Insight Consumer.',
            'From the coursework slides “IMC01-Nhom8”, Consumer Insight section (translated from Vietnamese).'
          ),
          execution: T(
            'Trọng tâm là thử thách 7 ngày “7 Mixes – 7 Mood – 7 ngày Chill”: mỗi ngày người dùng tự pha một công thức với G7 và đăng lên TikTok. TVC và OOH đóng vai trò nền nhận biết. Mục tiêu: thúc đẩy mua lại từ khách hàng trung thành và mở rộng khách hàng mới, định vị G7 là biểu tượng “Chất Việt Đỉnh Cao”, kết nối người trẻ với giá trị cà phê Việt.',
            'The centrepiece is a 7-day challenge, “7 Mixes – 7 Mood – 7 ngày Chill”: each day users mix their own G7 recipe and post it on TikTok. TVC and OOH build awareness underneath. Objectives: drive repeat purchase from loyal customers and win new ones, position G7 as the icon of “Chất Việt Đỉnh Cao” (peak Vietnamese quality), and connect young people with the value of Vietnamese coffee.'
          ),
          resultsHead: T('Kết quả', 'Results'),
          results: [
            T('Đồ án đạt điểm A.', 'Coursework graded A.'),
            T('KPI dự kiến: thử thách TikTok 525.000 người tiếp cận và 2,1 triệu lượt xem hashtag; TVC khoảng 25 triệu lượt reach; OOH khoảng 21 triệu lượt hiển thị và 9 triệu reach.', 'Planned KPIs: TikTok challenge reach of 525,000 people and 2.1 million hashtag views; TVC around 25 million reach; OOH around 21 million impressions and 9 million reach.'),
            T('Ngân sách dự kiến: 6.849.700.000 đồng cho 3 giai đoạn (TVC, thử thách, sự kiện).', 'Planned budget: 6,849,700,000 VND across 3 phases (TVC, challenge, event).')
          ],
          resultsNote: T('KPI và ngân sách là số kế hoạch của đồ án môn học, không phải kết quả của một chiến dịch đã chạy.', 'KPIs and budget are coursework planning figures, not results of a live campaign.'),
          resultsDate: null
        },
        links: [],
        linksNote: T('Minh chứng: ảnh chụp các trang slide, nguồn “Đồ án IMC – Nhóm 8”.', 'Evidence: screenshots of the slides, source “IMC coursework – Group 8”.'),
        gallery: [
          { file: 'tan-1', fig: T('Thử thách TikTok', 'TikTok challenge'), cap: T('Thử thách TikTok “7 Mixes – 7 Mood – 7 ngày Chill” (#G7challenge, #G7WeekOfFlavor) và phương án hợp tác KOL · Nguồn: Đồ án IMC – Nhóm 8', 'TikTok challenge “7 Mixes – 7 Mood – 7 ngày Chill” (#G7challenge, #G7WeekOfFlavor) and the KOL plan · Source: IMC coursework – Group 8') },
          { file: 'tan-2', fig: T('Customer journey', 'Customer journey'), cap: T('Hành trình mua hàng (customer journey) · Nguồn: Đồ án IMC – Nhóm 8', 'Customer journey · Source: IMC coursework – Group 8') },
          { file: 'tan-3', fig: T('Storyboard TVC', 'TVC storyboard'), cap: T('Storyboard TVC “G7 – Chất Việt Đỉnh Cao” · Nguồn: Đồ án IMC – Nhóm 8', 'TVC storyboard “G7 – Chất Việt Đỉnh Cao” · Source: IMC coursework – Group 8') },
          { file: 'tan-4', fig: T('OOH màn hình LED', 'OOH LED screens'), cap: T('Phương án quảng cáo OOH trên màn hình LED tại trung tâm thương mại và ngoài trời · Nguồn: Đồ án IMC – Nhóm 8', 'OOH plan on LED screens in shopping malls and outdoors · Source: IMC coursework – Group 8') },
          { file: 'tan-5', fig: T('Insight: Who, What/Why, Where', 'Insight: Who, What/Why, Where'), cap: T('Insight khách hàng: Who, What/Why (Behavior, Truth, Tension, Emotion), Where · Nguồn: Đồ án IMC – Nhóm 8', 'Customer insight: Who, What/Why (Behavior, Truth, Tension, Emotion), Where · Source: IMC coursework – Group 8') },
          { file: 'tan-6', fig: T('Insight Consumer', 'Consumer insight'), cap: T('Insight Consumer: “Tôi cần một sản phẩm cà phê vừa nhanh – tiện – chuẩn vị cà phê…” · Nguồn: Đồ án IMC – Nhóm 8', 'Consumer insight: “I need a coffee product that is fast, convenient and true to coffee taste…” · Source: IMC coursework – Group 8') }
        ],
        strip: [0, 1, 2, 3],
        slide: { stat: T('A', 'A'), statLabel: T('điểm đồ án IMC · trưởng nhóm, nhóm 8', 'IMC coursework grade · team leader, group 8'), img: 0 }
      }
    ],

    appendix: {
      title: T('Phụ lục · Hồ sơ An', 'Appendix · An’s profile'),
      cols: [
        {
          head: T('Giới thiệu bản thân', 'About me'),
          portrait: T('Ảnh chân dung', 'Portrait photo'),
          name: 'Đoàn Minh Duy An',
          items: [
            T('Sinh viên ngành Marketing, Đại học Văn Lang.', 'Marketing student at Văn Lang University.'),
            T('Định vị: Digital Marketing, mảng Content và E-commerce.', 'Focus: Digital Marketing, in Content and E-commerce.'),
            T('Lý do chọn nghề: bán hàng bằng bản năng trên Shopee cho mình hiểu ra, nội dung tốt phải đưa người đọc tiến thêm một bước tới quyết định mua.', 'Why marketing: selling on instinct on Shopee taught me that good content has to move the reader one step closer to a buying decision.'),
            T('Mục tiêu 1–2 năm: thực tập hoặc fresher Digital, Content, Trade Marketing.', 'Goal for the next 1–2 years: a Digital, Content or Trade Marketing internship or fresher role.'),
            T('Mục tiêu 3–5 năm: Marketing Specialist.', 'Goal in 3–5 years: Marketing Specialist.')
          ]
        },
        {
          head: T('Phong cách và điểm nhấn riêng', 'Style and signature'),
          mottoLabel: T('Châm ngôn', 'Motto'),
          motto: T(
            'Dùng lý trí kiên định để vẽ đường chiến lược, dùng trực giác linh hoạt để đọc vị cuộc đời.',
            'Steady reason to draw the strategy, flexible intuition to read life.'
          ),
          items: [
            T('Sở thích: nghệ thuật của sự chuyển đổi. Chỉ thêm vài nét chữ, An thành Bán, thành Lan, thành Vang.', 'Hobby: the art of transformation. Add a few strokes and An becomes Bán (sell), Lan (spread), Vang (resound).'),
            T('Phong cách: chuyên nghiệp, nhiều hiệu ứng, thể hiện qua chính website này.', 'Style: professional and rich in effects, as this website shows.')
          ]
        },
        {
          head: T('Năng động, chủ động', 'Drive and initiative'),
          items: [
            T('Vận hành gian hàng Shopee và dựng website Bean Cafe (đồ án cuối kì môn Phát triển website căn bản).', 'Runs a Shopee shop and built the Bean Cafe website (final project for Web Development Fundamentals).'),
            T('Ba dự án cộng đồng: <a href="#lan">Tôi, chúng ta</a>, <a href="#vang">Tuổi Hồng 27</a>, <a href="#toan">idX 2025</a>.', 'Three community projects: <a href="#lan">Tôi, chúng ta</a>, <a href="#vang">Tuổi Hồng 27</a>, <a href="#toan">idX 2025</a>.'),
            T('Trưởng nhóm ba đồ án: Nghiên cứu Marketing, IMC, Marketing kỹ thuật số.', 'Team leader on three course projects: Marketing Research, IMC, Digital Marketing.'),
            T('CLB Ong Sáng Tạo, ban Media.', 'Ong Sáng Tạo club, Media team.'),
            T('Tự học: IELTS (đang ôn), tiếng Đức trình độ A1 (đang học), các mô hình IMC, PESTEL, CSR, MBO.', 'Self-study: IELTS (preparing), German at A1 level (in progress), frameworks such as IMC, PESTEL, CSR and MBO.'),
            T('Công cụ: Canva, CapCut, Microsoft Office, Photoshop AI.', 'Tools: Canva, CapCut, Microsoft Office, Photoshop AI.')
          ]
        }
      ],
      projectsHead: T('Ba đồ án làm trưởng nhóm', 'Three course projects I led'),
      projects: [
        {
          id: 'nckh', grade: 'A+', cover: false,
          course: T('Nghiên cứu Marketing', 'Marketing Research'),
          topic: T('Mức độ hài lòng của sinh viên Đại học Văn Lang với sàn thương mại điện tử TikTok Shop', 'Văn Lang University students’ satisfaction with the TikTok Shop marketplace'),
          result: T('Khảo sát 311 sinh viên; mô hình giải thích 72,4% sự hài lòng, yếu tố mạnh nhất là Phân phối và Nền tảng.', 'Survey of 311 students; the model explains 72.4% of satisfaction, with Distribution and Platform as the strongest factors.')
        },
        {
          id: 'imc', grade: 'A', chapter: 'tan',
          course: T('Kế hoạch truyền thông tích hợp (IMC)', 'Integrated Marketing Communications (IMC)'),
          topic: T('Chiến dịch “G7 – Open Spirit” cho Trung Nguyên Legend, nhóm 8', '“G7 – Open Spirit” campaign for Trung Nguyên Legend, group 8'),
          result: T('Đồ án môn học đạt điểm A; chi tiết ở chương T·AN.', 'Coursework graded A; details in chapter T·AN.'),
          action: T('Đọc chương T·AN', 'Read chapter T·AN')
        },
        {
          id: 'dmkt', grade: 'A+',
          course: T('Marketing kỹ thuật số', 'Digital Marketing'),
          topic: T('Biti’s Hunter, nhóm 2', 'Biti’s Hunter, group 2'),
          result: T('Đồ án môn học đạt điểm A+.', 'Coursework graded A+.')
        }
      ],
      cover: T('Ảnh bìa slide', 'Slide cover')
    },

    next: {
      label: T('Chương tiếp', 'Next chapter'),
      lead: M(
        'Chương tiếp theo chưa được viết. Bạn chọn chữ nào?',
        'Còn chương tiếp theo, em muốn viết cùng thầy.',
        'The next chapter hasn’t been written yet. Which letter would you choose?'
      ),
      notice: M('Chữ bạn chọn sẽ được gửi cho An.', 'Chữ thầy chọn sẽ được gửi cho An.', 'The letter you choose will be sent to An.'),
      pre: T('Chữ cái đứng trước AN', 'Letters before AN'),
      post: T('Chữ cái đứng sau AN', 'Letters after AN'),
      combine: T('Ghép chữ ↵', 'Combine ↵'),
      again: T('Thử chữ khác', 'Try another letter'),
      empty: T('Gõ ít nhất một chữ cái vào ô trống.', 'Type at least one letter in a blank.'),
      sent: T('Đã gửi chữ cho An.', 'Sent to An.'),
      failed: T('Chưa gửi được chữ cho An. Kiểm tra kết nối mạng rồi ghép lại.', 'Couldn’t send it to An. Check your connection and combine again.'),
      words: {
        'S|G': { word: 'S·AN·G', a: M('Sang trang mới. Mình sẵn sàng cho chương tiếp theo.', 'Sang trang mới. Em sẵn sàng cho chương tiếp theo.', 'A new page. I’m ready for the next chapter.') },
        'TR|G': { word: 'TR·AN·G', a: M('Một trang còn trống, và mình muốn viết nó cùng bạn.', 'Một trang còn trống, và em muốn viết nó cùng thầy.', 'A blank page, and I’d love to write it with you.') },
        'D|': { word: 'Đ·AN', a: T('Lý trí và trực giác đan vào nhau.', 'Reason and intuition, woven together.') },
        'G|': { word: 'G·AN', a: T('Gan: dám thử điều chưa ai làm.', 'Daring to try what no one has tried.') },
        'B|': { word: 'B·AN', a: T('Cùng một ban, cùng một ê-kíp.', 'Same team, same crew.') }
      },
      other: M(
        'Chữ này mình chưa nghĩ tới. Có lẽ đó là chương mình cùng viết.',
        'Chữ này em chưa nghĩ tới. Có lẽ đó là chương mình cùng viết.',
        'I hadn’t thought of that one. Maybe it’s the chapter we write together.'
      ),
      goals: [
        T('Chương 6 · 1–2 năm tới: thực tập sinh hoặc fresher Digital, Content, Trade Marketing.', 'Chapter 6 · next 1–2 years: Digital, Content or Trade Marketing intern'),
        T('Chương 7 · 3–5 năm tới: Marketing Specialist.', 'Chapter 7 · in 3–5 years: Marketing Specialist')
      ]
    },

    contact: {
      line: T('Viết tiếp cùng An.', 'Keep writing with An.'),
      email: T('Gửi email', 'Send an email'),
      zalo: T('Nhắn Zalo', 'Message on Zalo'),
      qr: T('Mã QR website', 'Website QR code'),
      qrCv: T('Quét mã để xem CV', 'Scan to view the CV'),
      qrWait: T('chờ tên miền', 'waiting for the domain'),
      subject: '[Portfolio AN]'
    },

    present: {
      hint: T('←/→ chuyển slide · P biến thể chiếu · N nhịp tiếp · B màn đen · R chạy lại · +/− cỡ AN · Esc thoát', '←/→ slides · P projection · N next beat · B black · R replay · +/− AN size · Esc exit'),
      mottoLabel: T('Châm ngôn', 'Motto'),
      inviteLine: T('Chương tiếp theo chưa được viết.', 'The next chapter hasn’t been written yet.'),
      p2Words: ['IELTS prep', 'Deutsch A1 prep', 'IMC', 'PESTEL', '50/30/20'],
      p2Numbers: ['8.400', '883', '198', '128', '16', '70–80', '70%', '65.000', '1,5K', '227', '44', '1,7K', '4.7/5', '40', '111', '152', '133', '19', '14/4', '25/5', '9/6', '27/7', '26/7', '311', '72,4%', 'A+', 'A', '525.000', '2,1 tr', '25 tr', '21 tr', '9 tr'],
      // 6 bình luận cuộc thi “Lặng” cho P4: chỉ chữ, không tên. Điền sau khi “Tôi, chúng ta” đồng ý.
      p4Comments: [
        'hi vọng rằng khi đến với “lặng” các cậu sẽ tìm được sự đồng điệu cho bản thân và tâm hồn của mình nhé ^^',
        'Khám phá bản thân là một hành trình dài, cùng ghi lại hành trình đó với Lặng nhe',
        'Éc giữa những công việc nặng nhọc thì lặng một chút cũng hay',
        'Tham gia cuộc thi là một công đôi việc luôn, vừa show được skill, vừa xả được stress',
        'Hãy dành cho mình chút khoảng lặng trong tâm hồn, lắng nghe nhịp thở và con tim chính mình để vẽ những nét thăng hoa nhất cùng với “Lặng” nhé',
        'Lúc ngồi vẽ là lúc tâm hồn bình lặng nhất vì các nét vẽ sẽ thay mọi người nói lên nỗi lòng sâu thẳm bên trong. Ngại gì không tham gia cuộc thi để thể hiện tài năng và truyền tải câu chuyện của mình đến mọi người.'
      ],
      p4Placeholder: T('Bình luận cuộc thi “Lặng” · thay sau', '“Lặng” contest comment · replace later'),
      p6Cells: ['Draft due', 'Post date', 'Pitch', 'Pillar', 'Format', 'Hashtags', 'PIC', 'Status: DONE', 'Contestant 14/4–25/5', 'Observer 9/6–27/7', 'Trial Run 4/7 · 14/7', 'D-Day 26/7', 'Marketing brief 12/3', 'Campaign plan 20/3', 'Commplan draft 4/4', 'Final 7/4', 'Social media', 'Seeding', 'Email marketing', 'Branding items'],
      p7: [T('Digital Marketing: A+', 'Digital Marketing: A+'), T('Trưởng nhóm × 3', 'Team leader × 3')],
      p8: [
        { id: 'ban', kw: T('chuyển đổi', 'conversion') },
        { id: 'lan', kw: T('đo được', 'measurable') },
        { id: 'vang', kw: T('ê-kíp', 'crew') },
        { id: 'toan', kw: T('tiến độ', 'on schedule') },
        { id: 'tan', kw: T('chiến lược', 'strategy') }
      ],
      qrPh: T('Mã QR · thay sau', 'QR code · replace later')
    }
  };
})();
