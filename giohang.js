
    
let gioHang = JSON.parse(localStorage.getItem('gioHang')) || [];

function luuGioHang() {
    localStorage.setItem('gioHang', JSON.stringify(gioHang));
}


document.addEventListener('DOMContentLoaded', function() {

    const overlay = document.createElement('div');
    overlay.className = 'gio-hang-overlay';
    overlay.id = 'gioHangOverlay';
    document.body.appendChild(overlay);


    const panel = document.createElement('div');
    panel.className = 'gio-hang-panel';
    panel.id = 'gioHangPanel';

    panel.innerHTML = `
        <div class="gio-hang-tieu-de">
            <h2>🛒 Giỏ Hàng</h2>
            <button class="nut-dong" id="nutDongGio">✕</button>
        </div>
        <div class="gio-hang-danh-sach" id="danhSachSanPham">
            <!-- Sản phẩm sẽ được thêm vào đây bằng JS -->
        </div>
        <div class="gio-hang-tong" id="phanTongTien" style="display:none;">
            <div class="tong-tien-hang">
                <span>Tổng cộng:</span>
                <span id="tongTienHienThi">0 VND</span>
            </div>
            <button class="nut-thanh-toan" onclick="thanhToan()">💳 Thanh Toán</button>
            <button class="nut-xoa-het" onclick="xoaHetGio()">🗑️ Xóa Tất Cả</button>
        </div>
    `;
    document.body.appendChild(panel);

    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
       
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.id = 'cartBadge';
        cartIcon.appendChild(badge);

        cartIcon.addEventListener('click', moGioHang);
    }


    document.getElementById('nutDongGio').addEventListener('click', dongGioHang);


    overlay.addEventListener('click', dongGioHang);


    capNhatHienThi();
});


function moGioHang() {
    document.getElementById('gioHangPanel').classList.add('mo');
    document.getElementById('gioHangOverlay').classList.add('hien');
}

function dongGioHang() {
    document.getElementById('gioHangPanel').classList.remove('mo');
    document.getElementById('gioHangOverlay').classList.remove('hien');
}
function themVaoGio(nutBam) {

    const ten = nutBam.getAttribute('data-ten');
    const gia = parseInt(nutBam.getAttribute('data-gia')); 


    const viTri = gioHang.findIndex(sp => sp.ten === ten);

    if (viTri !== -1) {
        
        gioHang[viTri].soLuong += 1;
    } else {
        
        gioHang.push({
            ten: ten,
            gia: gia,
            soLuong: 1
        });
    }
    luuGioHang();
    capNhatHienThi();

    hienThongBao(ten + ' đã được thêm vào giỏ! 🛒');
}

function tangSoLuong(ten) {
    const viTri = gioHang.findIndex(sp => sp.ten === ten);
    if (viTri !== -1) {
        gioHang[viTri].soLuong += 1;
        luuGioHang();
        capNhatHienThi();
    }
}

function giamSoLuong(ten) {
    const viTri = gioHang.findIndex(sp => sp.ten === ten);
    if (viTri !== -1) {
        gioHang[viTri].soLuong -= 1;
      
        if (gioHang[viTri].soLuong <= 0) {
            gioHang.splice(viTri, 1);
        }
        luuGioHang();
        capNhatHienThi();
    }
}

function xoaSanPham(ten) {

    gioHang = gioHang.filter(sp => sp.ten !== ten);
    luuGioHang();
    capNhatHienThi();
}

function xoaHetGio() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
        gioHang = [];
        luuGioHang();
        capNhatHienThi();
    }
}



function capNhatHienThi() {
    const danhSach = document.getElementById('danhSachSanPham');
    const phanTong = document.getElementById('phanTongTien');
    const badge = document.getElementById('cartBadge');

    if (!danhSach) return; 

    const tongSoLuong = gioHang.reduce((tong, sp) => tong + sp.soLuong, 0);

    if (badge) {
        if (tongSoLuong > 0) {
            badge.textContent = tongSoLuong;
            badge.style.display = 'flex'; 
        } else {
            badge.style.display = 'none'; 
        }
    }

  
    if (gioHang.length === 0) {

        danhSach.innerHTML = `
            <div class="gio-hang-trong">
                <span>🛒</span>
                Giỏ hàng của bạn đang trống!
            </div>
        `;
        phanTong.style.display = 'none'; 
    } else {

        let htmlSanPham = '';

        gioHang.forEach(function(sp) {
            const thanhTien = sp.gia * sp.soLuong;

            htmlSanPham += `
                <div class="san-pham-trong-gio">
                    <div class="sp-thong-tin">
                        <div class="sp-ten">${sp.ten}</div>
                        <div class="sp-don-gia">${formatTien(sp.gia)} / sản phẩm</div>
                    </div>
                    <div class="sp-so-luong">
                        <button onclick="giamSoLuong('${sp.ten}')">−</button>
                        <span>${sp.soLuong}</span>
                        <button onclick="tangSoLuong('${sp.ten}')">+</button>
                    </div>
                    <div class="sp-thanh-tien">${formatTien(thanhTien)}</div>
                    <button class="sp-xoa" onclick="xoaSanPham('${sp.ten}')" title="Xóa">✕</button>
                </div>
            `;
        });

        danhSach.innerHTML = htmlSanPham;
        phanTong.style.display = 'block'; 

        const tongTien = gioHang.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0);
        document.getElementById('tongTienHienThi').textContent = formatTien(tongTien);
    }
}


function formatTien(so) {
    return so.toLocaleString('vi-VN') + ' VND';
}



function hienThongBao(noiDung) {
    // Tạo thẻ thông báo
    const thongBao = document.createElement('div');
    thongBao.textContent = noiDung;
    thongBao.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: green;
        color: white;
        padding: 12px 25px;
        border-radius: 25px;
        font-size: 15px;
        font-weight: bold;
        z-index: 99999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: hienRaThongBao 0.3s ease;
    `;

    document.body.appendChild(thongBao);

    // Tự xóa sau 2 giây
    setTimeout(() => {
        thongBao.style.opacity = '0';
        thongBao.style.transition = 'opacity 0.3s';
        setTimeout(() => thongBao.remove(), 300);
    }, 2000);
}