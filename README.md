# VLSP 
## vlsp_tool_backend

### Setup môi trường:

- Cài đặt mongodb theo hướng dẫn tại [link này](https://docs.mongodb.com/manual/installation/).
  Note: nếu không muốn dùng mongodb local thì có thể dùng Mongo Atlas, tuy nhiên việc này sẽ khiến việc truy nhập và chỉnh sửa tay bất tiện và mất thời gian.
- Clone prject này về, dùng terminal cd vào đường dẫn chứa thư mục và gõ npm install
- Nếu không có file .env thì hãy tạo file .env từ file env và cài đặt các biến môi trường thích hợp vào
- Sau khi hoàn tất cài đặt, gõ lệnh npm start để khởi chạy server

### Cấu trúc Project:

- Thư mục config sẽ lấy các biến môi trường từ file .env và export nó ra để có thể sử dụng
- Thư mục constants chứa các biến hằng được sử dụng trong project
- Thư mục controllers chứa các hàm điều khiển các request. Trong project này sẽ được chia theo role (admin / manager / user)
- Thư mục dáos chứa các file sẽ làm việc với Database
- Thư mục errors định nghĩa ra các lỗi, code các lỗi và message của các lỗi
- Thư mục middlewares chứa các middlewares cần thiết cho các request gửi đến
- Thư mục models định nghĩa ra Schema của các document được lưu trong Database
- Thư mục routes định nghĩa các URI của các request, chỉ định nó chạy qua những middleware nào
- Thư mục service là cầu nối kết Controllers và DAOs với nhau, mình sẽ viết toàn bộ logic nghiệp vụ ở đây
- Thư mục uploads là nơi lưu các file static được người dùng upload lên
- Thư mục utils chứa những hàm hay công cụ đặc biệt được sử dung bất kì đâu trong project

## vslp_tool_frontend

### Setup môi trường:

- Clone prject này về, dùng terminal cd vào đường dẫn chứa thư mục và gõ **npm install**
- Nếu không có file **.env** thì hãy tạo file **.env** từ file **env** và cài đặt các biến môi trường thích hợp vào
- Sau khi hoàn tất cài đặt, gõ lệnh **npm start** để khởi chạy server

### Cấu trúc Project:

- Thư mục apis chứa các apis mà các component có thể gọi từ bất cứ đâu trong project
- Thư mục config sẽ lấy các biến môi trường từ file .env và export nó ra để có thể sử dụng
- Thư mục constants chứa các biến hằng được sử dụng trong project
- Thư mục routes định nghĩa các routes của các pages, chỉ định page nào sẽ là route nào
- Thư mục utils chứa những hàm hay công cụ đặc biệt được sử dung bất kì đâu trong project

### Cấu trúc hệ thống:

- Có 3 role chính là **admin**, **manager** và **user** trong đó admin sẽ quản lý các người dùng, có thể tạo tài khoản người dùng và khóa tài khoản người dùng. Manager là người quản lý cuộc thi, do manager tạo ra. Và user là người tham gia cuộc thi, có thể tự đăng kí tài khoản hoặc admin tạo tài khoản.

### Trình tự luồng hoạt động toàn bộ hệ thống: (luồng đầy đủ)

1. Guest - Sau khi đã kết nối với Backend, bạn sẽ được redirect qua trang đăng nhập / đăng kí
2. Admin - Ở đây **admin** có thể đăng nhập với tài khoản được config ở phía Backend, để tạo ra **manager**
3. Manager - Sau khi đã có tài khoản **manager**, đăng nhập bằng tài khoản đó ta sẽ vào luồng chính của **manager**
4. Manager - Chọn mục **Quản lý cuộc thi**, ở đây **manager** có thể tạo cuộc thi, cài đặt các quá trình của cuộc thi
5. User - Sau khi tạo ra cuộc thi, các **user** đã có thể đăng kí vào cuộc thi ở mục cuộc thi, chọn đăng kí cuộc thi mong muốn. Khi đăng kí thì đội trưởng sẽ phải tạo đội bằng cách nhập tên đội, danh sách thành viên (không cần nhập tên đội trưởng). Sau khi bấm đăng kí, hệ thống sẽ tự động tạo đội và gửi email xác nhận join team cho danh sách email mà đội trưởng đã nhập. Nếu một thành viên đã ở trong đội khác thì sẽ phải tạo đội lại. Thành viên sau khi xác nhận gia nhập đội sẽ không thể gia nhập đội khác
6. Manager - Sau khi các đội đã hoàn tất đăng kí đầy đủ, **manager** sẽ tạo công việc thẩm định ở mục **Công việc thẩm định dữ liệu**. Sau khi tạo công việc thẩm định, hệ thống sẽ tự động gửi email nhắc nhở các đội vào hoàn thành công việc thẩm định.
7. User - Đăng nhập vào hệ thống, chọn **Cuộc thi**, chọn vào cuộc thi đã đăng kí, chọn mục **Công việc cần hoàn thành**. Ở đây sẽ có các mốc của cuộc thi, khi **manager** tạo công việc đến đâu, link các công việc sẽ xuất hiện theo thứ tự đó. Ở đây khi Manager tạo xong **Công việc thẩm định**, người dùng chọn vào mục **Thẩm định dữ liệu** và bắt đầu thẩm định bằng cách nghe audio rồi gõ lại nội dung, hoặc vote cho nội dung nhóm khác đã gõ nếu thấy nội dung đó chính xác. Sau khi các đội đã hoàn thành đủ số lượng audio quy định thì sẽ pass vòng thẩm định
8. Manager - Trong khi **user** đang thẩm định dữ liệu, **manager** có thể xem được tiến độ thẩm định dữ liệu, xem được kết quả thẩm định dữ liệu. Nếu đội nào chưa hoàn thành tiến độ, **manager** có thể bấm vào nút nhắc nhở để gửi email nhắc nhở đội đó hoàn thành công việc đúng hạn.
9. Manager - Sau khi các **user** hoàn tất công việc thẩm định dữ liệu, **manager** sẽ chia sẻ dữ liệu huấn luyện ở mục **Chia sẻ dữ liệu huấn luyện**. Sau khi **manager** upload dữ liệu lên kèm bản scan cam kết, hệ thống sẽ tự động gửi mail cho các đội đã vượt qua vòng thẩm định để thông báo.
10. User - Sau khi **manager** đã chia sẻ dữ liệu huấn luyện lên, **user** sẽ vào lại đúng cuộc thi, vào mục **Công việc cần hoàn thành** và chọn mục **Yêu cầu dữ liệu huấn luyện**. Ở đây, **user** cần download bản scan cam kết về, kí và upload lên để **manager** kiểm tra. Mỗi đội chỉ cần 1 thành viên vào yêu cầu dữ liệu.
11. Manager - Sau khi **user** upload bản cam kết, **manager** sẽ thấy nó trong bảng **Danh sách các đội yêu cầu dữ liệu huấn luyện** ở mục **Chia sẻ dữ liệu huấn luyện**. Xem bản cam kết ở cột **Bản cam kết** và bấm xác nhận để cho phép đội đó truy cập vào dữ liệu huấn luyện
12. User - Sau khi được **manager** cho phép truy cập dữ liệu huấn luyện, user sẽ download ở mục **Dữ liệu được chia sẻ**.
13. Manager - Sau khi các đội đã tải dữ liệu về, xây dựng được hệ thống riêng, **manager** sẽ tạo công việc nộp kết quả lên (sẽ là API hoặc file docker) ở mục **Công việc nộp kết quả**
14. User - Các **user** sẽ vào **Công việc cần hoàn thành**, chọn **Nộp kết quả** để upload file mô tả API hoặc link Docker (**Phần này hiện tại mình chưa check API hoặc docker tự động, sẽ làm sau**)
15. Manager - Sau khi sử dụng các API hoặc docker để tạo ra các audios từ các file text để tạo ra bộ test. **Manager** sẽ tạo bài thí nghiệm trong mục **Bài thí nghiệm**. Ngoài các config của bài thí nghiệm, file zip upload lên sẽ có format như sau: bao gồm 2 folder, folder thứ nhất tên là **'text'**, chứa các câu text. Folder thứ là **'audio'** sẽ chứa các folder con có tên là **id của các đội** tham gia cuộc thi, trong mỗi folder đó là các audio được tạo ra từ hệ thống tổng hợp tiếng nói mà đội đó đã nộp lên. Ứng với mỗi câu text trong folder **text**, bộ audio của mỗi đội đều sẽ có duy nhất 1 audio ứng với câu text đó. Ví dụ câu text là **01.txt** thì trong folder của đội X có tên là 'id_cua_doi_X' sẽ có một audio ứng với câu text trên có tên là **01-HAHA.wav** với **HAHA** là mã giọng của đội đó. Lưu ý là các audio chỉ được phép có định dạng **.wav**. Hệ thống sau khi nhận được số dữ liệu này sẽ tạo ra một số bộ test nhất định theo config của **manager**.
16. User - Sau khi Manager tạo bài thí nghiệm, **user** có thể truy cập vào làm bài thí nghiệm nếu bài thí nghiệm đó là public hoặc private nhưng user đó được **manager** chỉ định làm bài thí nghiệm. **User** chọn vào bài thí nghiệm cần làm ở trang chủ, nghe audio và đánh giá mức điểm thích hợp.
17. Manager - Sau khi hoặc trong khi bài thí nghiệm được làm thì **manager** có thể vào xem chi tiết bài thí nghiệm. Thấy ổn thì có thể bấm gửi kết quả để gửi kết quả cho các đội. Lưu ý là kết quả sẽ chỉ gửi cho các đội đã đăng kí cuộc thi, còn đội nằm ngoài cuộc thi sẽ không gửi. Đồng thời Hệ thống sẽ gửi mail báo cho các đội rằng đã có kết quả thí nghiệm.
18. User - Các đội sau khi nhận được kết quả các bài thí nghiệm sẽ làm báo cáo để gửi cho BTC. Lấy kết quả thí nghiệm ở mục **Kết quả thí nghiệm** trong cuộc thi tương ứng.
19. Manager - Tạo công việc nộp báo cáo
20. User - Vào mục **Công việc cần hoàn thành** và chọn **Nộp báo cáo** để upload bản report cho hệ thống

### Kết thúc luồng
