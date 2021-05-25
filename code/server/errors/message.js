const codes = require('./code');

const getErrorMessage = (code) => {
  switch (code) {
    case codes.NOT_AVAILABLE:
      return 'Tài nguyên không có sẵn';
    case codes.USER_NOT_FOUND:
      return 'Không tìm thấy người dùng';
    case codes.WRONG_PASSWORD:
      return 'Password không đúng';
    case codes.EMAIL_EXISTED:
      return 'Email đã tồn tại';
    case codes.EMAIL_NOT_EXIST:
      return 'Email không tồn tại';
    case codes.MIME_TYPE_INVALID:
      return 'File upload không đúng định dạng';
    case codes.DATE_TIME_INVALID:
      return 'Kiểm tra lại ngày tháng bạn đã chọn';
    case codes.TOKEN_INVALID:
      return 'Token không hợp lệ';
    case codes.TEAM_EXISTED:
      return 'Tên đội đã tồn tại';
    case codes.MEMBER_EXISTED:
      return 'Thành viên đã tồn tại';
    case codes.DATA_TRAINING_NOT_AVAILABLE:
      return 'Không tìm thấy dữ liệu huấn luyện';
    case codes.NOT_VALID_CONDITION:
      return 'Không đủ điều kiện';
    case codes.INVALID_FORMAT:
      return 'Format của file bị sai';
    case codes.TEST_EXISTED:
      return 'Tên bài thí nghiệm đã tồn tại';
    case codes.LOCKED_USER:
      return 'Tài khoản của bạn đã bị khóa';
    case codes.WRONG_TIME:
      return 'Đây không phải thời gian phù hợp';
    default:
      return null;
  }
};

module.exports = getErrorMessage;
