document.addEventListener('DOMContentLoaded', () => {

    // --- Seleksi Elemen Halaman ---
    const registerPage = document.getElementById('register-page');
    const loginPage = document.getElementById('login-page');
    const appPage = document.getElementById('app-page');
    const pages = [registerPage, loginPage, appPage];

    // --- Seleksi Elemen Form ---
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const depositForm = document.getElementById('deposit-form');
    const withdrawForm = document.getElementById('withdraw-form');

    // --- Seleksi Elemen Navigasi ---
    const gotoLoginLink = document.getElementById('goto-login');
    const gotoRegisterLink = document.getElementById('goto-register');
    const logoutButton = document.getElementById('logout-button');
    
    // --- Seleksi Tampilan Aplikasi ---
    const userDisplay = document.getElementById('user-display');
    const balanceDisplay = document.getElementById('balance-display');
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const headerNavButtons = document.querySelectorAll('.header-nav-button');
    const loginUsernameInput = document.getElementById('login-username');

    // --- Seleksi Info Penarikan ---
    const wdBank = document.getElementById('wd-bank');
    const wdAccountNumber = document.getElementById('wd-account-number');
    const wdAccountName = document.getElementById('wd-account-name');

    // --- Seleksi Elemen Menu & Deposit ---
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const depositMethodSelect = document.getElementById('deposit-method');
    const depositInfoContainer = document.getElementById('deposit-info-container');
    const depositBankName = document.getElementById('deposit-bank-name');
    const depositAccountNumber = document.getElementById('deposit-account-number');
    const depositAccountName = document.getElementById('deposit-account-name');
    const qrisImageContainer = document.getElementById('qris-image-container');

    // --- [BARU] Seleksi Elemen Modal Game ---
    const gameSlots = document.querySelectorAll('.game-slot');
    const gameModal = document.getElementById('game-modal');
    const closeModalButton = document.querySelector('.close-button');


    // --- Data Rekening Tujuan Deposit ---
    const depositAccounts = {
        'dana': { bank: 'DANA', number: '083827273737', name: 'Hengki' },
        'gopay': { bank: 'GOPAY', number: '081234567890', name: 'Hengki P.' },
        'bca': { bank: 'BCA', number: '1234567890', name: 'Hengki Pratama' },
        'bri': { bank: 'BRI', number: '0987654321', name: 'Hengki Pratama' }
    };

    // --- Fungsi Bantuan ---
    function showPage(pageId) {
        pages.forEach(page => page.classList.toggle('active', page.id === pageId));
    }
    function showAppContent(contentId) {
        contentSections.forEach(section => section.classList.toggle('active', section.id === contentId));
        navButtons.forEach(button => button.classList.toggle('active', button.dataset.target === contentId));
    }
    function login(userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        userDisplay.textContent = userData.username;
        balanceDisplay.textContent = 'Rp 0';
        if (wdBank) {
            wdBank.textContent = userData.bank;
            wdAccountNumber.textContent = userData.accountNumber;
            wdAccountName.textContent = userData.accountName;
        }
        showPage('app-page');
        showAppContent('games-content');
    }

    // --- Logika Halaman Awal ---
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedInUser) {
        login(loggedInUser);
    } else {
        showPage('login-page');
        const lastUsername = localStorage.getItem('lastUsername');
        if (lastUsername) {
            loginUsernameInput.value = lastUsername;
        }
    }

    // --- Event Listener ---

    // Menu Tiga Titik
    menuToggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    window.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });

    // KODE LAMA (Hapus atau ganti ini)
// Pilihan Deposit Dinamis (jika ada formnya)
if (depositMethodSelect) {
    depositMethodSelect.addEventListener('change', () => {
        const selectedMethod = depositMethodSelect.value;
        if (selectedMethod && depositAccounts[selectedMethod]) {
            const account = depositAccounts[selectedMethod];
            depositBankName.textContent = account.bank;
            depositAccountNumber.textContent = account.number;
            depositAccountName.textContent = account.name;
            depositInfoContainer.style.display = 'block';
        } else {
            depositInfoContainer.style.display = 'none';
        }
    });
}

    // Pendaftaran
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedBank = document.querySelector('input[name="bank"]:checked');
        if (!selectedBank) {
            alert('Silakan pilih bank atau e-wallet!');
            return;
        }
        const newUser = {
            username: document.getElementById('reg-username').value,
            phone: document.getElementById('reg-phone').value,
            whatsapp: document.getElementById('reg-whatsapp').value,
            bank: selectedBank.value,
            accountNumber: document.getElementById('reg-account-number').value,
            accountName: document.getElementById('reg-account-name').value,
        };
        localStorage.setItem(newUser.username, JSON.stringify(newUser));
        localStorage.setItem('lastUsername', newUser.username);
        alert('Pendaftaran berhasil! Anda akan otomatis login.');
        login(newUser);
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value;
        const userDataString = localStorage.getItem(username);
        if (userDataString) {
            alert('Login berhasil!');
            login(JSON.parse(userDataString));
        } else {
            alert('Username tidak ditemukan.');
        }
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser) {
            localStorage.setItem('lastUsername', currentUser.username);
            loginUsernameInput.value = currentUser.username;
        }
        localStorage.removeItem('currentUser');
        alert('Anda telah logout.');
        showPage('login-page');
    });

    // Link Navigasi
    gotoLoginLink.addEventListener('click', (e) => { e.preventDefault(); showPage('login-page'); });
    gotoRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showPage('register-page'); });
    navButtons.forEach(button => button.addEventListener('click', () => showAppContent(button.dataset.target)));
    headerNavButtons.forEach(button => button.addEventListener('click', () => showAppContent(button.dataset.target)));

    // Form Deposit & Penarikan (jika ada formnya)
    if (depositForm) {
        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Deposit telah di proses');
            depositForm.reset();
            if (depositInfoContainer) {
                depositInfoContainer.style.display = 'none';
            }
        });
    }
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Simulasi: Permintaan penarikan telah dikirim.`);
            withdrawForm.reset();
        });
    }
    
    // Interaksi Game Slot
    gameSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            gameModal.style.display = 'block';
        });
    });

    function closeModal() {
        gameModal.style.display = 'none';
    }

    closeModalButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == gameModal) {
            closeModal();
        }
    });
});
                                                 
