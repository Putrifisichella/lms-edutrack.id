// ======================== edutrack.js ========================
// Simulasi database dengan localStorage

// Inisialisasi data awal jika belum ada
function initData() {
    if (!localStorage.getItem('users')) {
        const users = [
            { id: 1, email: 'admin@edutrack.id', password: 'admin123', role: 'admin', name: 'Admin' },
            { id: 2, email: 'sarah@edutrack.id', password: 'guru123', role: 'guru', name: 'Ibu Sarah Reeyn S.Pd', mataPelajaran: 'Informatika' },
            { id: 3, email: 'ahmad@edutrack.id', password: 'siswa123', role: 'siswa', name: 'Ahmad Rizki', kelas: '10-A', nis: '12345' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    if (!localStorage.getItem('guru_list')) {
        const guruList = [
            { id: 1, nama: 'Ibu Sarah Reeyn S.Pd', email: 'reeynsrh@gmail.com', mataPelajaran: 'Informatika' },
            { id: 2, nama: 'Bpk. Ahmad Fauzi', email: 'fauzi@edutrack.id', mataPelajaran: 'Matematika' },
        ];
        localStorage.setItem('guru_list', JSON.stringify(guruList));
    }
    if (!localStorage.getItem('siswa_list')) {
        const siswaList = [
            { id: 1, nama: 'Ahmad Rizki', email: 'ahmdrzkyyy@gmail.com', kelas: '11-A' },
            { id: 2, nama: 'Siti Columbina', email: 'siti@edutrack.id', kelas: '11-A' },
        ];
        localStorage.setItem('siswa_list', JSON.stringify(siswaList));
    }
    if (!localStorage.getItem('kelas_list')) {
        const kelasList = [
            { id: 1, nama: '11-A', mataPelajaran: 'Informatika', jumlahSiswa: 26 },
            { id: 2, nama: '10-B', mataPelajaran: 'Informatika', jumlahSiswa: 20 },
        ];
        localStorage.setItem('kelas_list', JSON.stringify(kelasList));
    }
    if (!localStorage.getItem('tugas_list')) {
        const tugasList = [
            { id: 1, judul: 'Tugas Informatika', deskripsi: 'Kerjakan Quiz tentang Pertemuan ke-4', mapel: 'Informatika', kelas: '11-A', deadline: '2026-04-24', file: '', guruId: 2, status: 'aktif' },
            { id: 2, judul: 'Tugas Bahasa Inggris', deskripsi: 'Write a 2-page essay', mapel: 'Bahasa Inggris', kelas: '10-B', deadline: '2026-06-05', file: '', guruId: 2, status: 'aktif' }
        ];
        localStorage.setItem('tugas_list', JSON.stringify(tugasList));
    }
    if (!localStorage.getItem('pengumpulan')) {
        localStorage.setItem('pengumpulan', JSON.stringify([]));
    }
}

// Helper: ambil user yang sedang login
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

// Redirect jika belum login
function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        alert('Akses ditolak!');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Render data dinamis berdasarkan halaman
document.addEventListener('DOMContentLoaded', function() {
    initData();
    const path = window.location.pathname.split('/').pop();
    
    // ==================== LOGIN PAGE ====================
    if (path === 'login.html') {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                const password = form.querySelector('input[type="password"]').value;
                const users = JSON.parse(localStorage.getItem('users'));
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    if (user.role === 'admin') window.location.href = 'dashboard_admin.html';
                    else if (user.role === 'guru') window.location.href = 'dashboard_guru.html';
                    else window.location.href = 'dashboard_siswa.html';
                } else {
                    alert('Email atau password salah!');
                }
            });
        }
    }
    
    // ==================== DASHBOARD ADMIN ====================
    if (path === 'dashboard_admin.html') {
        if (!requireAuth(['admin'])) return;
        // Tampilkan jumlah data
        const totalSiswa = JSON.parse(localStorage.getItem('siswa_list') || '[]').length;
        const totalGuru = JSON.parse(localStorage.getItem('guru_list') || '[]').length;
        const totalKelas = JSON.parse(localStorage.getItem('kelas_list') || '[]').length;
        const cardSiswa = document.querySelector('.grid .bg-white:first-child .text-2xl');
        const cardGuru = document.querySelectorAll('.grid .bg-white')[1]?.querySelector('.text-2xl');
        const cardKelas = document.querySelectorAll('.grid .bg-white')[2]?.querySelector('.text-2xl');
        if (cardSiswa) cardSiswa.innerText = totalSiswa;
        if (cardGuru) cardGuru.innerText = totalGuru;
        if (cardKelas) cardKelas.innerText = totalKelas;
        
        // Menu navigasi ke halaman kelola
        const menuSiswa = document.querySelector('.space-y-3 .border:first-child');
        const menuGuru = document.querySelectorAll('.space-y-3 .border')[1];
        const menuKelas = document.querySelectorAll('.space-y-3 .border')[2];
        if (menuSiswa) menuSiswa.addEventListener('click', () => window.location.href = 'daftar_siswa.html');
        if (menuGuru) menuGuru.addEventListener('click', () => window.location.href = 'daftar_guru.html');
        if (menuKelas) menuKelas.addEventListener('click', () => window.location.href = 'daftar_kelas.html');
    }
    
    // ==================== DAFTAR SISWA (Admin) ====================
    if (path === 'daftar_siswa.html') {
        if (!requireAuth(['admin'])) return;
        const tbody = document.querySelector('tbody');
        function renderSiswa() {
            const siswaList = JSON.parse(localStorage.getItem('siswa_list') || '[]');
            tbody.innerHTML = '';
            siswaList.forEach(s => {
                const row = `<tr>
                    <td class="px-6 py-5">${s.nama}</td>
                    <td class="px-6 py-5 font-normal text-slate-700">${s.email}</td>
                    <td class="px-6 py-5 text-center">${s.kelas}</td>
                    <td class="px-6 py-5 text-center text-sm">
                        <button class="edit-siswa hover:text-indigo-600 transition" data-id="${s.id}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                    </td>
                </tr>`;
                tbody.insertAdjacentHTML('beforeend', row);
            });
            document.querySelectorAll('.edit-siswa').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.dataset.id);
                    const siswa = siswaList.find(s => s.id === id);
                    const newNama = prompt('Nama baru:', siswa.nama);
                    if (newNama) {
                        siswa.nama = newNama;
                        localStorage.setItem('siswa_list', JSON.stringify(siswaList));
                        renderSiswa();
                    }
                });
            });
        }
        renderSiswa();
        // Tombol tambah (jika ada, bisa ditambahkan manual di HTML, tapi kita buat floating)
        const mainDiv = document.querySelector('.bg-white.p-8');
        if (mainDiv && !document.getElementById('btnTambahSiswa')) {
            const btn = document.createElement('button');
            btn.id = 'btnTambahSiswa';
            btn.className = 'mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold';
            btn.innerHTML = '+ Tambah Siswa';
            btn.onclick = () => {
                const newNama = prompt('Nama siswa');
                const newEmail = prompt('Email');
                const newKelas = prompt('Kelas');
                if (newNama && newEmail && newKelas) {
                    const siswaList = JSON.parse(localStorage.getItem('siswa_list') || '[]');
                    const newId = Date.now();
                    siswaList.push({ id: newId, nama: newNama, email: newEmail, kelas: newKelas });
                    localStorage.setItem('siswa_list', JSON.stringify(siswaList));
                    renderSiswa();
                }
            };
            mainDiv.appendChild(btn);
        }
    }
    
    // ==================== DAFTAR GURU (Admin) ====================
    if (path === 'daftar_guru.html') {
        if (!requireAuth(['admin'])) return;
        const tbody = document.querySelector('tbody');
        function renderGuru() {
            const guruList = JSON.parse(localStorage.getItem('guru_list') || '[]');
            tbody.innerHTML = '';
            guruList.forEach(g => {
                const row = `<tr>
                    <td class="px-6 py-5">${g.nama}</td>
                    <td class="px-6 py-5 font-normal text-slate-700">${g.email}</td>
                    <td class="px-6 py-5"><span class="bg-[#00b4d8] text-white text-[10px] px-3 py-1 rounded-full">${g.mataPelajaran}</span></td>
                    <td class="px-6 py-5 text-center"><button class="edit-guru hover:text-indigo-600" data-id="${g.id}"><i class="fa-regular fa-pen-to-square"></i></button></td>
                </tr>`;
                tbody.insertAdjacentHTML('beforeend', row);
            });
            document.querySelectorAll('.edit-guru').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const guru = guruList.find(g => g.id === id);
                    const newNama = prompt('Nama baru:', guru.nama);
                    if (newNama) guru.nama = newNama;
                    const newMapel = prompt('Mata Pelajaran baru:', guru.mataPelajaran);
                    if (newMapel) guru.mataPelajaran = newMapel;
                    localStorage.setItem('guru_list', JSON.stringify(guruList));
                    renderGuru();
                });
            });
        }
        renderGuru();
        const mainDiv = document.querySelector('.bg-white.p-8');
        if (mainDiv && !document.getElementById('btnTambahGuru')) {
            const btn = document.createElement('button');
            btn.id = 'btnTambahGuru';
            btn.className = 'mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold';
            btn.innerHTML = '+ Tambah Guru';
            btn.onclick = () => {
                const nama = prompt('Nama guru');
                const email = prompt('Email');
                const mapel = prompt('Mata Pelajaran');
                if (nama && email && mapel) {
                    const guruList = JSON.parse(localStorage.getItem('guru_list') || '[]');
                    guruList.push({ id: Date.now(), nama, email, mataPelajaran: mapel });
                    localStorage.setItem('guru_list', JSON.stringify(guruList));
                    renderGuru();
                }
            };
            mainDiv.appendChild(btn);
        }
    }
    
    // ==================== DAFTAR KELAS (Admin) ====================
    if (path === 'daftar_kelas.html') {
        if (!requireAuth(['admin'])) return;
        const container = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
        function renderKelas() {
            const kelasList = JSON.parse(localStorage.getItem('kelas_list') || '[]');
            container.innerHTML = '';
            kelasList.forEach(k => {
                const card = `<div class="border border-black p-5 rounded-2xl bg-white shadow-sm relative flex flex-col justify-between h-32">
                    <div><h3 class="text-base font-bold text-black">${k.nama}</h3><p class="text-xs font-medium text-black mt-0.5">${k.mataPelajaran}</p></div>
                    <p class="text-[10px] text-gray-400 font-medium">${k.jumlahSiswa} Siswa</p>
                    <button class="edit-kelas absolute top-5 right-5 text-black hover:text-indigo-600" data-id="${k.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                </div>`;
                container.insertAdjacentHTML('beforeend', card);
            });
            document.querySelectorAll('.edit-kelas').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const kelas = kelasList.find(k => k.id === id);
                    const newNama = prompt('Nama kelas baru:', kelas.nama);
                    if (newNama) kelas.nama = newNama;
                    localStorage.setItem('kelas_list', JSON.stringify(kelasList));
                    renderKelas();
                });
            });
        }
        renderKelas();
    }
    
    // ==================== DASHBOARD GURU & BUAT TUGAS & MANAJEMEN TUGAS ====================
    if (path === 'dashboard_guru.html') {
        if (!requireAuth(['guru'])) return;
        const user = getCurrentUser();
        const tugasList = JSON.parse(localStorage.getItem('tugas_list') || '[]');
        const myTugas = tugasList.filter(t => t.guruId === user.id);
        document.querySelector('.grid .bg-white:nth-child(2) .text-2xl').innerText = myTugas.filter(t => t.status === 'aktif').length;
        document.querySelector('.grid .bg-white:nth-child(3) .text-2xl').innerText = myTugas.length;
        // Tombol Buat Tugas
        const btnBuat = document.querySelector('button:has(.fa-plus)') || document.querySelector('button:contains("Buat Tugas")');
        if (btnBuat) btnBuat.onclick = () => window.location.href = 'buat_tugas.html';
        const btnManajemen = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Manajemen Tugas'));
        if (btnManajemen) btnManajemen.onclick = () => window.location.href = 'manajemen_tugas.html';
        // Tampilkan tugas terbaru
        const tugasContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
        if (tugasContainer && myTugas.length) {
            tugasContainer.innerHTML = myTugas.slice(0,2).map(t => `<div class="border border-gray-200 p-4 rounded-xl"><h3 class="text-xs font-bold">${t.judul}</h3><p class="text-[11px] text-gray-400">${t.deskripsi.substring(0,50)}</p><div class="flex justify-between text-[10px] mt-2"><span>${t.mapel} - ${t.kelas}</span><span>Deadline: ${t.deadline}</span></div></div>`).join('');
        }
    }
    
    if (path === 'buat_tugas.html') {
        if (!requireAuth(['guru'])) return;
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const judul = form.querySelector('input[placeholder*="Judul"]').value;
            const deskripsi = form.querySelector('textarea').value;
            const mapel = form.querySelector('select').value;
            const kelas = form.querySelectorAll('select')[1].value;
            const deadline = form.querySelector('input[type="date"]').value;
            if (!judul || !deskripsi || !kelas || !deadline) {
                alert('Lengkapi semua field!');
                return;
            }
            const tugasList = JSON.parse(localStorage.getItem('tugas_list') || '[]');
            const newId = Date.now();
            const user = getCurrentUser();
            tugasList.push({ id: newId, judul, deskripsi, mapel, kelas, deadline, file: '', guruId: user.id, status: 'aktif' });
            localStorage.setItem('tugas_list', JSON.stringify(tugasList));
            alert('Tugas berhasil dibuat!');
            window.location.href = 'manajemen_tugas.html';
        });
    }
    
    if (path === 'manajemen_tugas.html') {
        if (!requireAuth(['guru'])) return;
        const tbody = document.querySelector('tbody');
        function renderTugas() {
            const user = getCurrentUser();
            const tugasList = JSON.parse(localStorage.getItem('tugas_list') || '[]');
            const myTugas = tugasList.filter(t => t.guruId === user.id);
            tbody.innerHTML = '';
            myTugas.forEach(t => {
                const row = `<tr>
                    <td class="px-6 py-4"><div class="font-bold text-black text-xs">${t.judul}</div><p class="text-gray-400 text-[10px]">${t.deskripsi.substring(0,60)}</p></td>
                    <td class="px-4 py-4">${t.mapel}</td>
                    <td class="px-4 py-4 text-center">${t.kelas}</td>
                    <td class="px-4 py-4 text-center">${t.deadline}</td>
                    <td class="px-4 py-4 text-center">0/26</td>
                    <td class="px-4 py-4 text-center">0</td>
                    <td class="px-6 py-4 text-center"><a href="detail_tugas.html?id=${t.id}" class="font-bold text-black underline">Lihat</a></td>
                </tr>`;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        }
        renderTugas();
        const btnBuat = document.querySelector('button:has(.fa-plus)');
        if (btnBuat) btnBuat.onclick = () => window.location.href = 'buat_tugas.html';
    }
    
    if (path === 'detail_tugas.html') {
        if (!requireAuth(['guru'])) return;
        const urlParams = new URLSearchParams(window.location.search);
        const tugasId = parseInt(urlParams.get('id'));
        const tugasList = JSON.parse(localStorage.getItem('tugas_list') || '[]');
        const tugas = tugasList.find(t => t.id === tugasId);
        if (tugas) {
            document.querySelector('.border p-6 h3').innerText = tugas.judul;
            document.querySelector('.border p-6 p').innerText = tugas.deskripsi;
            document.querySelectorAll('.flex-wrap span')[0].innerText = `${tugas.mapel} - ${tugas.kelas}`;
            document.querySelectorAll('.flex-wrap span')[1].innerText = `Deadline: ${tugas.deadline}`;
        }
        // Tampilkan siswa yang mengumpulkan (simulasi)
        const siswaContainer = document.querySelector('.space-y-2.max-h-\\[280px\\]');
        if (siswaContainer) {
            siswaContainer.innerHTML = '<div class="text-center text-gray-400 text-xs">Belum ada pengumpulan</div>';
        }
    }
    
    // ==================== DASHBOARD SISWA & RAPOR ====================
    if (path === 'dashboard_siswa.html') {
        if (!requireAuth(['siswa'])) return;
        const user = getCurrentUser();
        const tugasList = JSON.parse(localStorage.getItem('tugas_list') || '[]');
        const tugasSiswa = tugasList.filter(t => t.kelas === user.kelas);
        document.querySelector('.grid .bg-white:first-child .text-2xl').innerText = tugasSiswa.filter(t => t.status === 'aktif').length;
        // Tampilkan tugas belum dikerjakan
        const belumContainer = document.querySelector('.bg-white.p-6.rounded-xl.shadow-sm.border:first-of-type + .bg-white');
        if (belumContainer && tugasSiswa.length) {
            belumContainer.innerHTML = `<h2 class="text-sm font-bold text-black mb-4">Tugas Belum Dikerjakan</h2>${tugasSiswa.slice(0,1).map(t => `<div class="border p-4 rounded-xl"><h3 class="text-xs font-bold">${t.judul}</h3><p>${t.deskripsi}</p><p class="text-[10px] text-red-500 mt-2">Deadline: ${t.deadline}</p><button class="mt-2 bg-blue-500 text-white text-xs px-3 py-1 rounded kumpul-tugas" data-id="${t.id}">Kumpulkan</button></div>`).join('')}`;
            document.querySelectorAll('.kumpul-tugas').forEach(btn => {
                btn.onclick = () => { alert('Tugas berhasil dikumpulkan (simulasi)'); btn.remove(); };
            });
        }
    }
    
    if (path === 'rapor_digital.html') {
        if (!requireAuth(['siswa'])) return;
        // Data rapor statis (bisa diambil dari localStorage)
        const nilai = [
            { mapel: 'Matematika', lalu: 80, ini: 85 },
            { mapel: 'Bahasa Indonesia', lalu: 85, ini: 90 },
            { mapel: 'Bahasa Inggris', lalu: 90, ini: 88 },
            { mapel: 'Fisika', lalu: 78, ini: 82 },
            { mapel: 'Kimia', lalu: 83, ini: 87 },
            { mapel: 'Biologi', lalu: 88, ini: 92 }
        ];
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        nilai.forEach(n => {
            const perubahan = n.ini - n.lalu;
            const status = perubahan >= 0 ? 'text-emerald-500' : 'text-rose-500';
            const icon = perubahan >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
            tbody.innerHTML += `<tr>
                <td class="px-6 py-3.5">${n.mapel}</td>
                <td class="px-6 py-3.5 text-center text-gray-400">${n.lalu}</td>
                <td class="px-6 py-3.5 text-center text-indigo-600">${n.ini}</td>
                <td class="px-6 py-3.5 text-center ${status}"><i class="fa-solid ${icon} mr-1"></i>${perubahan>0?'+'+perubahan:perubahan}</td>
                <td class="px-6 py-3.5 text-center"><span class="bg-emerald-50 text-emerald-600 text-[10px] px-2.5 py-0.5 rounded-full">Selesai</span></td>
            </tr>`;
        });
        const rataLalu = nilai.reduce((a,b)=>a+b.lalu,0)/nilai.length;
        const rataIni = nilai.reduce((a,b)=>a+b.ini,0)/nilai.length;
        tbody.innerHTML += `<tr class="bg-gray-50 font-bold"><td class="px-6 py-3.5">Rata-rata</td><td class="text-center">${rataLalu.toFixed(0)}</td><td class="text-center text-indigo-600">${rataIni.toFixed(0)}</td><td class="text-center text-emerald-500">+${(rataIni-rataLalu).toFixed(0)}</td><td></td></tr>`;
    }
    
    // ==================== LOGOUT DI SEMUA HALAMAN ====================
    const logoutBtn = document.querySelector('header button:has(.fa-right-from-bracket)');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Perbaiki semua tautan sidebar ke halaman yang benar
    const links = {
        'Dashboard': { admin: 'dashboard_admin.html', guru: 'dashboard_guru.html', siswa: 'dashboard_siswa.html' },
        'Tugas': { guru: 'manajemen_tugas.html' },
        'Kelola Data Siswa': { admin: 'daftar_siswa.html' },
        'Kelola Data Guru': { admin: 'daftar_guru.html' },
        'Kelola Data Kelas': { admin: 'daftar_kelas.html' },
        'Rapor Digital': { siswa: 'rapor_digital.html' }
    };
    document.querySelectorAll('nav a, .menu-item').forEach(a => {
        const text = a.innerText.trim();
        const user = getCurrentUser();
        if (user && links[text] && links[text][user.role]) {
            a.href = links[text][user.role];
            a.addEventListener('click', (e) => { if (a.href !== '#') return; e.preventDefault(); window.location.href = links[text][user.role]; });
        }
    });
});