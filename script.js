document.addEventListener('DOMContentLoaded', () => {

const audio = document.querySelector('audio');
document.addEventListener('click', () => {
  audio.play();
});

    // --- SELEKTOR ELEMEN DOM ---
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const authButtonsDiv = document.getElementById('auth-buttons');
    const userInfoDiv = document.getElementById('user-info');

    // --- FUNGSI UTAMA UNTUK MENGATUR TAMPILAN UI LOGIN ---
    const updateUIForLoginState = () => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // Jika ada pengguna yang login
            authButtonsDiv.classList.add('hidden');
            userInfoDiv.classList.remove('hidden');
            document.getElementById('welcome-message').textContent = `Selamat Datang, ${currentUser}!`;
        } else {
            // Jika tidak ada yang login
            authButtonsDiv.classList.remove('hidden');
            userInfoDiv.classList.add('hidden');
        }
    };

    // --- LOGIKA MODAL (BUKA/TUTUP) ---
    const setupModal = (triggerId, modalElement) => {
        const trigger = document.getElementById(triggerId);
        const form = modalElement.querySelector('form');
        const messageElement = modalElement.querySelector('.form-message');

        trigger.addEventListener('click', () => modalElement.classList.remove('hidden'));
        
        modalElement.querySelector('.close-modal').addEventListener('click', () => {
            modalElement.classList.add('hidden');
            form.reset(); // Bersihkan form saat ditutup
            messageElement.textContent = ''; // Bersihkan pesan error/sukses
        });

        // Tutup modal jika klik di luar area konten
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                modalElement.classList.add('hidden');
                form.reset();
                messageElement.textContent = '';
            }
        });
    };

    setupModal('login-trigger', loginModal);
    setupModal('register-trigger', registerModal);

    // --- LOGIKA SIMULASI REGISTER ---
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value; // Di dunia nyata, ini harus di-hash!
        const messageElement = document.getElementById('register-message');
        
        // Ambil data user dari localStorage atau buat array baru jika kosong
        let users = JSON.parse(localStorage.getItem('nexust_users')) || [];

        // Cek jika username sudah ada
        if (users.find(user => user.username === username)) {
            messageElement.textContent = 'Username sudah digunakan!';
            messageElement.className = 'form-message error';
            return;
        }

        // Tambahkan user baru
        users.push({ username, password });
        localStorage.setItem('nexust_users', JSON.stringify(users));

        messageElement.textContent = 'Registrasi berhasil! Mengarahkan ke halaman login...';
        messageElement.className = 'form-message success';
        
        // Tambahkan delay untuk membuatnya "terasa nyata"
        setTimeout(() => {
            registerModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
            document.getElementById('register-form').reset();
            messageElement.textContent = '';
        }, 1000);
    });

    // --- LOGIKA SIMULASI LOGIN ---
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const messageElement = document.getElementById('login-message');
        
        let users = JSON.parse(localStorage.getItem('nexust_users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            messageElement.textContent = 'Login berhasil!';
            messageElement.className = 'form-message success';
            
            // Simpan state login
            localStorage.setItem('currentUser', user.username);
            
            setTimeout(() => {
                loginModal.classList.add('hidden');
                document.getElementById('login-form').reset();
                messageElement.textContent = '';
                updateUIForLoginState(); // Perbarui tampilan navigasi
            }, 1000);
        } else {
            messageElement.textContent = 'Username atau password salah!';
            messageElement.className = 'form-message error';
        }
    });

    // --- LOGIKA LOGOUT ---
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        updateUIForLoginState();
    });

    // --- FUNGSI ORDER VIA WHATSAPP ---
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const productName = card.querySelector('h2').innerText;
            const productPrice = card.querySelector('.price').innerText.replace(/\n/g, ' '); // Rapikan teks harga

            // GANTI DENGAN NOMOR WA ANDA (format 62, bukan 0)
            const adminWhatsAppNumber = '62895419445933'; 
            
            const message = `Halo xxzzyy Store, saya tertarik untuk memesan:\n\n*Produk:* ${productName}\n*Harga:* ${productPrice}\n\nMohon informasinya. Terima kasih.`;
            const whatsappURL = `https://api.whatsapp.com/send?phone=${adminWhatsAppNumber}&text=${encodeURIComponent(message)}`;
            
            window.open(whatsappURL, '_blank');
        });
    });

    // --- ANIMASI LATAR BELAKANG BINTANG ---
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    function setCanvasSize() { canvas.width = window.innerWidth; canvas.height = document.body.scrollHeight; }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    const stars = [];
    for (let i = 0; i < 500; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 1.5, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2 });
    }
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        stars.forEach(star => { ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fill(); });
    }
    function updateStars() {
        stars.forEach(star => {
            star.x += star.vx; star.y += star.vy;
            if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
            if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
        });
    }
    function animate() { drawStars(); updateStars(); requestAnimationFrame(animate); }
    
    // --- INISIALISASI SAAT HALAMAN DIMUAT ---
    updateUIForLoginState();
    animate();
});
