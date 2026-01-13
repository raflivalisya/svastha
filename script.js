// Init Icons
feather.replace();

// Toggle Navbar
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = (e) => {
    navbarNav.classList.toggle('active');
    e.preventDefault();
};

// Toggle Cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
    shoppingCart.classList.toggle('active');
    e.preventDefault();
};

// === LOGIKA KERANJANG (CART) ===
let cart = [];

function addToCart(baseId, name, price, image, sizeElementId = null) {
    let finalId = String(baseId);
    let finalName = name;

    // Cek Ukuran jika barang memerlukan ukuran
    if (sizeElementId) {
        const sizeSelect = document.getElementById(sizeElementId);
        if (sizeSelect) {
            const sizeValue = sizeSelect.value;
            if (!sizeValue) {
                alert("Silakan pilih ukuran terlebih dahulu!");
                return;
            }
            finalId = `${baseId}-${sizeValue}`;
            finalName = `${name} (Size: ${sizeValue})`;
        }
    }

    // Cek jika item sudah ada di keranjang
    const existingItem = cart.find(item => item.id === finalId);
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
    shoppingCart.classList.add('active'); // Buka cart otomatis
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('total-price');
    const badge = document.getElementById('cart-count');

    container.innerHTML = '';
    let totalPrice = 0;
    let totalCount = 0;

    // Jika Keranjang Kosong
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; margin-top:3rem; color:#666;">
               <i data-feather="shopping-bag" style="width:40px;"></i>
               <p>Keranjang kosong.</p>
            </div>`;
        footer.style.display = 'none';
        badge.style.display = 'none';
        feather.replace();
        return;
    }

    // Jika Ada Isi
    footer.style.display = 'block';

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div style="flex:1;">
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
        container.appendChild(div);
    });

    feather.replace(); // Refresh icon
    totalEl.innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
    badge.innerText = totalCount;
    badge.style.display = 'block';
}

function changeQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) removeItem(id);
        else updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function continueShopping() {
    shoppingCart.classList.remove('active');
    document.getElementById('menu').scrollIntoView({behavior: 'smooth'});
}

// === LOGIKA MODAL & WHATSAPP ===
const modal = document.getElementById('checkout-modal');

function openCheckoutModal() {
    modal.style.display = 'block';
    shoppingCart.classList.remove('active');
}

function closeCheckoutModal() {
    modal.style.display = 'none';
}

function processFinalOrder() {
    // Ambil data dari form
    const nama = document.getElementById('c-nama').value;
    const tempat = document.getElementById('c-tempat').value;
    const tanggal = document.getElementById('c-tanggal').value;
    const jam = document.getElementById('c-jam').value;
    const alamat = document.getElementById('c-alamat').value;
    const sosmed = document.getElementById('c-sosmed').value;

    // --- GANTI NOMOR WA ADMIN DI SINI ---
    const nomorWA = "6285835484908"; 

    // Format Pesan
    let pesan = `Halo Admin Svastha Outdoor, saya mau sewa:%0A%0A`;
    pesan += `*DATA PENYEWA*%0A`;
    pesan += `Nama: ${nama}%0A`;
    pesan += `Tempat: ${tempat}%0A`;
    pesan += `Tgl Ambil: ${tanggal} jam ${jam}%0A`;
    pesan += `Alamat: ${alamat}%0A`;
    pesan += `Sosmed: ${sosmed}%0A%0A`;

    pesan += `*DAFTAR ALAT*%0A`;
    let grandTotal = 0;
    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        grandTotal += subtotal;
        pesan += `${index+1}. ${item.name} (x${item.quantity})%0A`;
    });

    pesan += `%0A*Total: Rp ${grandTotal.toLocaleString('id-ID')}*%0A`;
    pesan += `--------------------------------%0A`;
    pesan += `Info: Siap DP Booking 50%`;

    // Kirim ke WhatsApp
    window.open(`https://wa.me/${nomorWA}?text=${pesan}`, '_blank');
    
    // Tutup Modal
    closeCheckoutModal();
}

// Klik area gelap untuk tutup modal
window.onclick = function(e) {
    if (e.target == modal) modal.style.display = "none";
}
