
// cài đặt thời gian tự auto
const doneTypingInterval = 500; // Time in ms, 500ms

// tự động tìm kiếm tài khoản admin sau 500ms
const input = document.getElementById('searchInput');
let typingTimerAdmin; // Timer identifier for admin search

if (input) {
    input.addEventListener('input', () => {
        clearTimeout(typingTimerAdmin); // Xóa bộ đếm thời gian trước đó
        typingTimerAdmin = setTimeout(() => {
            console.log('Submitting admin search form');
            document.getElementById('searchForm').submit(); // Gửi biểu mẫu sau 1 giây
        }, doneTypingInterval);
    });

    input.addEventListener('keydown', () => {
        clearTimeout(typingTimerAdmin); // Xóa bộ đếm thời gian khi nhấn phím xuống để khởi động lại quá trình đếm ngược
    });
} else {
    console.error('Admin input element not found');
}

// -------------------------------------------------------------------------------------------------------------------------------------

// tự động tìm kiếm sản phẩm sau 500ms
const inputSP = document.getElementById('searchInputSP');
let typingTimerSP; // Timer identifier for product search

if (inputSP) {
    inputSP.addEventListener('input', () => {
        clearTimeout(typingTimerSP); // Xóa bộ đếm thời gian trước đó
        typingTimerSP = setTimeout(() => {
            console.log('Submitting product search form');
            document.getElementById('searchFormSP').submit(); // Gửi biểu mẫu sau 1 giây
        }, doneTypingInterval);
    });

    inputSP.addEventListener('keydown', () => {
        clearTimeout(typingTimerSP); // Xóa bộ đếm thời gian khi nhấn phím xuống để khởi động lại quá trình đếm ngược
    });
} else {
    console.error('Product input element not found');
}

// tự động tìm kiếm tkkh sau 500ms
const inputTKKH = document.getElementById('SearchKH');
let typingTimerTKKH; // Timer identifier for product search

if (inputTKKH) {
    inputTKKH.addEventListener('input', () => {
        clearTimeout(typingTimerTKKH); // Xóa bộ đếm thời gian trước đó
        typingTimerTKKH = setTimeout(() => {
            console.log('Submitting product search form');
            document.getElementById('searchInputTKKH').submit(); // Gửi biểu mẫu sau 1 giây
        }, doneTypingInterval);
    });

    inputTKKH.addEventListener('keydown', () => {
        clearTimeout(typingTimerTKKH); // Xóa bộ đếm thời gian khi nhấn phím xuống để khởi động lại quá trình đếm ngược
    });
} else {
    console.error('Product input element not found');
}