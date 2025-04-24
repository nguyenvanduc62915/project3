function togglePassword(index, actualPassword) {
    var passwordSpan = document.getElementById('password' + index);
    var toggleIcon = document.getElementById('togglePasswordIcon' + index);

    // Toggle password visibility
    if (passwordSpan.innerHTML === '********') {
        passwordSpan.innerHTML = actualPassword; // Display the actual password
        toggleIcon.className = 'fas fa-eye text-primary'; // Icon when password is visible
    } else {
        passwordSpan.innerHTML = '********'; // Hide the actual password
        toggleIcon.className = 'fas fa-eye-slash'; // Icon when password is hidden
    }
}

function toggleShowHide(index, iconElement) {
    var element = document.getElementById('showttsp' + index);
    var elementt = document.getElementById('showttspp' + index);
    console.log("element: ", element);
    if (element.style.display === 'none' || element.style.display === '' || elementt.style.display === 'none' || elementt.style.display === '') {
        element.style.display = 'block';
        elementt.style.display = 'block';
        // Thay đổi icon sang con mắt khi show
        iconElement.innerHTML = '<i id="viewIcon' + index + '" title="Ấn vào để thu gọn xem chi tiết" class="fas fa-eye text-danger me-2"></i>Hide View Token';
    } else {
        element.style.display = 'none';
        elementt.style.display = 'none';
        // Thay đổi icon sang gạch chéo khi hide
        iconElement.innerHTML = '<i id="viewIcon' + index + '" title="Ấn vào để xem chi tiết" class="fas fa-eye-slash text-primary me-2"></i>View Token';
    }
}