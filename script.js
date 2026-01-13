// Toggle Navbar & Cart (Sama seperti sebelumnya)
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = (e) => {
  navbarNav.classList.toggle('active');
  e.preventDefault();
};
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// --- LOGIKA KERANJANG (DIPERBARUI) ---

let cart = [];

// Fungsi Tambah Barang
function addToCart(baseId, name, price, image, sizeElementId) {
    let finalName = name;
    let finalId = baseId;

    // 1. Cek apakah produk ini butuh ukuran?
    if (sizeElementId) {
        const sizeValue = document.getElementById(sizeElementId).value;
        if (!sizeValue) {
            alert("Harap pilih ukuran terlebih dahulu!");
            return;
        }
        // Tambahkan info size ke nama & ID agar unik
        finalName = `${name} (Size: ${sizeValue})`;
        finalId = `${baseId}-${sizeValue}`; 
    }

    // 2. Cek apakah barang (dengan size sama) sudah ada di cart?
    const existingItem = cart.find((item) => item.id === finalId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: finalId,
            name: finalName,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateCartUI();
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

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; margin-top:2rem;">Keranjang kosong.</p>';
        countBadge.style.display = 'none';
        totalElement.innerText = 'Rp 0';
        return;
    }

    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        // ID string perlu dikutip agar fungsi JS jalan
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

    feather.replace();
    totalElement.innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
    countBadge.innerText = totalCount;
    countBadge.style.display = 'block';
}

// Helper Functions
function changeQuantity(id, change) {
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity === 0) cart.splice(itemIndex, 1);
        updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
}

// --- LOGIKA MODAL & CHECKOUT ---

const modal = document.getElementById("checkout-modal");

// 1. Buka Modal saat tombol di keranjang diklik
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }
    modal.style.display = "block";
    shoppingCart.classList.remove('active'); // Tutup sidebar
}

// 2. Tutup Modal
function closeCheckoutModal() {
    modal.style.display = "none";
}

// 3. PROSES FINAL (Kirim ke WA)
function processFinalOrder() {
    // Ambil data dari Form
    const nama = document.getElementById('c-nama').value;
    const tempat = document.getElementById('c-tempat').value;
    const tanggal = document.getElementById('c-tanggal').value;
    const jam = document.getElementById('c-jam').value;
    const alamat = document.getElementById('c-alamat').value;
    const sosmed = document.getElementById('c-sosmed').value;

    // --- NOMOR WA ADMIN (GANTI DISINI) ---
    const nomorWA = "6285835484908"; 
    
    // Susun Pesan
    let pesan = `Halo Admin Svastha Outdoor, saya mau sewa:%0A%0A`;
    
    // Header Data Diri
    pesan += `*DATA PENYEWA*%0A`;
    pesan += `Nama: ${nama}%0A`;
    pesan += `Tempat Ambil: ${tempat}%0A`;
    pesan += `Tgl Ambil: ${tanggal}%0A`;
    pesan += `Jam: ${jam}%0A`;
    pesan += `Alamat: ${alamat}%0A`;
    pesan += `Sosmed: ${sosmed}%0A%0A`;

    // Daftar Barang
    pesan += `*BARANG YANG DISEWA*%0A`;
    let totalBayar = 0;
    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        totalBayar += subtotal;
        pesan += `${index+1}. ${item.name} (x${item.quantity})%0A`;
    });

    // Footer & Pembayaran
    pesan += `%0A*Total: Rp ${totalBayar.toLocaleString('id-ID')}*%0A`;
    pesan += `--------------------------------%0A`;
    pesan += `*PEMBAYARAN*%0A`;
    pesan += `Via SeaBank: 901692635388%0A`;
    pesan += `Status: Siap DP Booking 50%`;

    // Kirim
    window.open(`https://wa.me/${nomorWA}?text=${pesan}`, '_blank');
    
    // Reset Cart & Tutup Modal (Optional)
    // cart = []; 
    // updateCartUI();
    closeCheckoutModal();
}

// Klik di luar modal untuk menutup
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
