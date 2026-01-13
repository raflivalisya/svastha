// Toggle Navbar
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = (e) => {
    navbarNav.classList.toggle('active');
    e.preventDefault();
};

// Toggle Shopping Cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
    shoppingCart.classList.toggle('active');
    e.preventDefault();
};

// --- LOGIKA KERANJANG (DIPERBARUI & STABIL) ---

let cart = [];

// Fungsi Tambah Barang
function addToCart(baseId, name, price, image, sizeElementId = null) {
    let finalName = name;
    
    // PENTING: Paksa ID menjadi String agar konsisten saat dibandingkan nanti
    let finalId = String(baseId); 

    // 1. Cek apakah produk ini butuh ukuran?
    if (sizeElementId) {
        const sizeSelect = document.getElementById(sizeElementId);
        // Pastikan elemen select ditemukan untuk menghindari error
        if (sizeSelect) {
            const sizeValue = sizeSelect.value;
            if (!sizeValue || sizeValue === "") {
                alert("Harap pilih ukuran terlebih dahulu!");
                return;
            }
            // UPDATE: Gabungkan ID + Ukuran (Contoh: "101-L")
            finalName = `${name} (${sizeValue})`; // Tampilan nama lebih rapi
            finalId = `${baseId}-${sizeValue}`;   // ID Unik
        }
    }

    // 2. Cek apakah barang (dengan ID unik ini) sudah ada di cart?
    const existingItem = cart.find((item) => item.id === finalId);

    if (existingItem) {
        // Jika ID Unik sama (Barang sama & Ukuran sama) -> Tambah Qty
        existingItem.quantity++;
    } else {
        // Jika belum ada -> Item Baru
        cart.push({
            id: finalId, // Disimpan sebagai String
            name: finalName,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateCartUI();
    
    // Otomatis buka sidebar keranjang saat tambah barang
    if(!shoppingCart.classList.contains('active')) {
        shoppingCart.classList.add('active');
    }
}

// Render UI Keranjang
function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('total-price');
    const countBadge = document.getElementById('cart-count');

    cartContainer.innerHTML = '';
    let totalPrice = 0;
    let totalCount = 0;

    // Jika Kosong
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; margin-top:2rem; color:#666;">Keranjang kosong.</p>';
        countBadge.style.display = 'none';
        totalElement.innerText = 'Rp 0';
        return;
    }

    // Loop Item
    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        // Perhatikan tanda kutip '' pada onclick agar String ID terbaca benar
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-detail">
                <h3>${item.name}</h3>
                <div class="item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                <div class="quantity-controls">
                    <button onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <div class="remove-item" onclick="removeItem('${item.id}')">
                <i data-feather="trash-2"></i>
            </div>
        `;
        cartContainer.appendChild(itemElement);
    });

    // Render Icon Feather (Trash icon)
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    totalElement.innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
    countBadge.innerText = totalCount;
    countBadge.style.display = 'block';
}

// Helper Functions
function changeQuantity(id, change) {
    // Cari index berdasarkan String ID
    const itemIndex = cart.findIndex((item) => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Hapus jika qty jadi 0
        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        }
        updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
}

// --- LOGIKA MODAL & CHECKOUT (WA) ---

const modal = document.getElementById("checkout-modal");

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }
    modal.style.display = "block";
    shoppingCart.classList.remove('active'); 
}

function closeCheckoutModal() {
    modal.style.display = "none";
}

function processFinalOrder() {
    const nama = document.getElementById('c-nama').value;
    const tempat = document.getElementById('c-tempat').value;
    const tanggal = document.getElementById('c-tanggal').value;
    const jam = document.getElementById('c-jam').value;
    const alamat = document.getElementById('c-alamat').value;
    const sosmed = document.getElementById('c-sosmed').value;

    // --- NOMOR WA ADMIN ---
    const nomorWA = "6285835484908"; 
    
    // Validasi Form Sederhana
    if(!nama || !tanggal) {
        alert("Mohon lengkapi Nama dan Tanggal Sewa");
        return;
    }

    let pesan = `Halo Admin Svastha Outdoor, saya mau sewa:%0A%0A`;
    
    pesan += `*DATA PENYEWA*%0A`;
    pesan += `Nama: ${nama}%0A`;
    pesan += `Tempat Ambil: ${tempat}%0A`;
    pesan += `Tgl Ambil: ${tanggal}%0A`;
    pesan += `Jam: ${jam}%0A`;
    pesan += `Alamat: ${alamat}%0A`;
    pesan += `Sosmed: ${sosmed}%0A%0A`;

    pesan += `*BARANG YANG DISEWA*%0A`;
    let totalBayar = 0;
    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        totalBayar += subtotal;
        // item.name sudah mengandung info Size (misal: Tenda A (Size L))
        pesan += `${index+1}. ${item.name} (x${item.quantity})%0A`;
    });

    pesan += `%0A*Total: Rp ${totalBayar.toLocaleString('id-ID')}*%0A`;
    pesan += `--------------------------------%0A`;
    pesan += `*PEMBAYARAN*%0A`;
    pesan += `Via SeaBank: 901692635388%0A`;
    pesan += `Status: Siap DP Booking 50%`;

    window.open(`https://wa.me/${nomorWA}?text=${pesan}`, '_blank');
    
    closeCheckoutModal();
}

// Klik luar modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
