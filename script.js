// script.js - Bonne Fête by Foufa

// ===== وظائف السلة العامة (تستخدم في صفحة الطلب) =====
let cart = [];

// إضافة منتج إلى السلة (تستدعى من صفحة الطلب)
function addToCart(name, size, price) {
    const item = {
        name: name,
        size: size,
        price: price
    };
    cart.push(item);
    updateCartDisplay();
    // حفظ السلة في التخزين المحلي اختيارياً
    localStorage.setItem('bonnefete_cart', JSON.stringify(cart));
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartList || !cartTotal) return;

    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.textContent = `${item.name} (${item.size}) - ${item.price} ج.م`;
        // زر حذف (اختياري)
        const removeBtn = document.createElement('span');
        removeBtn.textContent = ' ✖';
        removeBtn.style.color = 'red';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginRight = '10px';
        removeBtn.onclick = () => {
            removeFromCart(index);
        };
        li.prepend(removeBtn);
        cartList.appendChild(li);
    });
    cartTotal.textContent = total;
}

// حذف عنصر من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    localStorage.setItem('bonnefete_cart', JSON.stringify(cart));
}

// تفريغ السلة
function clearCart() {
    cart = [];
    updateCartDisplay();
    localStorage.removeItem('bonnefete_cart');
}

// تحميل السلة من التخزين المحلي عند بدء الصفحة
function loadCart() {
    const saved = localStorage.getItem('bonnefete_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCartDisplay();
        } catch (e) {
            console.error('خطأ في تحميل السلة');
        }
    }
}

// إرسال الطلب عبر واتساب
function sendOrderViaWhatsApp() {
    if (cart.length === 0) {
        alert('السلة فارغة! أضف منتجات أولاً.');
        return;
    }

    let message = '🍪 *طلب جديد من Bonne Fête by Foufa* 🍪\n\n';
    cart.forEach(item => {
        message += `• ${item.name} (${item.size}): ${item.price} ج.م\n`;
    });
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    message += `\n💵 *الإجمالي: ${total} ج.م*`;
    message += `\n\nالرجاء تأكيد الطلب وسيتم الرد قريباً.`;

    // ترميز الرسالة لاستخدامها في رابط واتساب
    const encoded = encodeURIComponent(message);
    // استبدل الرقم أدناه برقم الواتساب الخاص بك (بالصيغة الدولية بدون +)
    window.open(`https://wa.me/201027930131?text=${encoded}`, '_blank');
}

// تكبير الصورة (عرض مؤقت)
function zoomImage(img) {
    // يمكن استبدال هذه الدالة بمكتبة مثل Lightbox
    // هنا نعرض الصورة في نافذة منبثقة بسيطة
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.style.cursor = 'zoom-out';
    modal.onclick = () => document.body.removeChild(modal);

    const largeImg = document.createElement('img');
    largeImg.src = img.src;
    largeImg.style.maxWidth = '90%';
    largeImg.style.maxHeight = '90%';
    largeImg.style.borderRadius = '10px';
    largeImg.style.boxShadow = '0 0 20px gold';

    modal.appendChild(largeImg);
    document.body.appendChild(modal);
}

// تنفيذ بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل السلة إذا كنا في صفحة الطلب
    if (document.getElementById('cart-items')) {
        loadCart();
    }

    // ربط زر واتساب إذا كان موجوداً
    const whatsappBtn = document.getElementById('whatsapp-order');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendOrderViaWhatsApp);
    }

    // تفعيل تكبير الصور على أي صورة داخل منتج أو معرض
    const productImages = document.querySelectorAll('.product-card img, .gallery-item img');
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            zoomImage(this);
        });
    });

    // إضافة زر تفريغ السلة (اختياري)
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
});