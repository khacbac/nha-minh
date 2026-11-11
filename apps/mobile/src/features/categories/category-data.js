/**
 * The category catalog (spec §3.1): grid order, name, icon (lib/theme/icons.js), tint
 * (tokens.js `semantic.tint`), money kind and the suggested titles. The first title is the one
 * the form fills in when the category is picked (spec §2.3).
 *
 * CommonJS so the HTML design (dev/design) loads the same list from disk. `id` is permanent
 * and must be one of CATEGORY_IDS in @sonha/types; `catalog.test.ts` checks both lists match.
 */
const categories = [
  {
    id: "market",
    name: "Đi chợ",
    icon: "basket",
    tint: "sage",
    money: "expense",
    titles: ["Đi chợ", "Siêu thị", "Mua rau thịt", "Mua trái cây"],
  },
  {
    id: "food",
    name: "Ăn uống",
    icon: "utensils",
    tint: "clay",
    money: "expense",
    titles: ["Ăn ngoài", "Ăn sáng", "Cà phê", "Đặt đồ ăn"],
  },
  {
    id: "bills",
    name: "Hoá đơn",
    icon: "receipt",
    tint: "slate",
    money: "expense",
    titles: ["Tiền điện", "Tiền nước", "Internet", "Điện thoại", "Tiền nhà"],
  },
  {
    id: "transport",
    name: "Đi lại",
    icon: "scooter",
    tint: "sky",
    money: "expense",
    titles: ["Đổ xăng", "Gửi xe", "Grab", "Sửa xe", "Rửa xe"],
  },
  {
    id: "kids",
    name: "Con cái",
    icon: "baby",
    tint: "amber",
    money: "expense",
    titles: ["Học phí", "Sữa", "Bỉm", "Đồ chơi", "Tiêm phòng"],
  },
  {
    id: "spiritual",
    name: "Phước thiện",
    icon: "lotus",
    tint: "plum",
    money: "expense",
    titles: ["Cúng rằm", "Cúng mùng 1", "Cúng giường", "Thả cá", "Đi chùa", "Giỗ"],
  },
  {
    id: "occasions",
    name: "Hiếu hỉ",
    icon: "gift",
    tint: "rose",
    money: "expense",
    titles: ["Mừng cưới", "Phúng viếng", "Mừng sinh nhật", "Thăm ốm", "Lì xì"],
  },
  {
    id: "health",
    name: "Sức khoẻ",
    icon: "heart",
    tint: "teal",
    money: "expense",
    titles: ["Khám bệnh", "Mua thuốc", "Bảo hiểm", "Tập thể dục"],
  },
  {
    id: "shopping",
    name: "Mua sắm",
    icon: "bag",
    tint: "clay",
    money: "expense",
    titles: ["Quần áo", "Đồ gia dụng", "Mua online", "Mỹ phẩm"],
  },
  {
    id: "home",
    name: "Nhà cửa",
    icon: "home",
    tint: "olive",
    money: "expense",
    titles: ["Sửa chữa", "Đồ dùng trong nhà", "Cây cảnh", "Gas"],
  },
  {
    id: "family",
    name: "Gia đình",
    icon: "users",
    tint: "teal",
    money: "expense",
    titles: ["Đi chơi", "Về quê", "Biếu ông bà", "Họp mặt"],
  },
  {
    id: "pets",
    name: "Thú cưng",
    icon: "paw",
    tint: "sand",
    money: "expense",
    titles: ["Thức ăn", "Khám thú y", "Tắm tỉa"],
  },
  {
    id: "chores",
    name: "Việc nhà",
    icon: "sparkle",
    tint: "sky",
    money: "none",
    titles: ["Dọn nhà", "Giặt giũ", "Nấu ăn", "Tưới cây", "Thay ga giường"],
  },
  {
    id: "moments",
    name: "Kỷ niệm",
    icon: "star",
    tint: "amber",
    money: "none",
    titles: ["Ngày đáng nhớ", "Bé biết đi", "Bé mọc răng", "Kỷ niệm ngày cưới"],
  },
  {
    id: "income",
    name: "Thu nhập",
    icon: "wallet",
    tint: "sage",
    money: "income",
    titles: ["Lương", "Thưởng", "Bán hàng", "Được biếu", "Lãi tiết kiệm"],
  },
  {
    id: "other",
    name: "Khác",
    icon: "dots",
    tint: "slate",
    money: "expense",
    titles: ["Chi khác", "Ghi chú"],
  },
];

module.exports = { categories };
