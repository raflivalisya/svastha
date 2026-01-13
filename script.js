// --- FUNGSI BARU: TAMBAH PESANAN ---
function continueShopping() {
    // 1. Tutup Sidebar Keranjang
    const shoppingCart = document.querySelector('.shopping-cart');
    shoppingCart.classList.remove('active');

    // 2. (Opsional) Scroll otomatis ke bagian Produk/Menu
    // Pastikan di HTML Anda ada id="menu" atau id="products"
    const productSection = document.querySelector('#menu'); 
    if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- UPDATE FUNGSI RENDER UI ---
function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('total-price');
    const countBadge = document.getElementById('cart-count');
    const cartFooter = document.getElementById('cart-footer'); // Ambil elemen footer

    cartContainer.innerHTML = '';
    let totalPrice = 0;
    let totalCount = 0;

    // SKENARIO: JIKA KERANJANG KOSONG
    if (cart.length === 0) {
        // Tampilkan pesan kosong & Tombol Mulai Belanja
        cartContainer.innerHTML = `
            <div style="text-align:center; margin-top:3rem; padding: 2rem;">
                <p style="margin-bottom: 1rem; color:#666;">Keranjang Anda kosong.</p>
                <button onclick="continueShopping()" 
                        style="padding:8px 16px; background:var(--primary); color:#fff; border:none; cursor:pointer; border-radius:5px;">
                    Mulai Belanja
                </button>
            </div>
        `;
        
        // Sembunyikan Footer (Total & Tombol Checkout)
        cartFooter.style.display = 'none';
        
        countBadge.style.display = 'none';
        totalElement.innerText = 'Rp 0';
        return;
    }

    // SKENARIO: ADA BARANG
    // Munculkan Footer
    cartFooter.style.display = 'block';

    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
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

    if (typeof feather !== 'undefined') feather.replace();
    
    totalElement.innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
    countBadge.innerText = totalCount;
    countBadge.style.display = 'block';
}
