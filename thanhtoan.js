

const THONG_TIN_NGAN_HANG = {
    soTaiKhoan:  '5020754925',       
    chuTaiKhoan: 'DUONG KHAC QUAN',     
    nganHang:    'BIDV',         
    chiNhanh:    'Chi nhánh Lam Sơn',   

    anhQR: 'https://img.vietqr.io/image/BIDV-5020754925-compact.png'
};



let anhBillDaTai = null;   
let buocHienTai = 1;  



document.addEventListener('DOMContentLoaded', function() {

    const html = `
    <!-- Lớp phủ tối -->
    <div class="tt-overlay" id="ttOverlay">

        <!-- Hộp thanh toán -->
        <div class="tt-hop">

            <!-- Tiêu đề -->
            <div class="tt-tieu-de">
                <h2>💳 Thanh Toán Đơn Hàng</h2>
                <button class="tt-nut-dong" id="ttNutDong">✕</button>
            </div>

            <!-- Chỉ báo bước -->
            <div class="tt-chi-bao-buoc" id="ttChiBaoBuoc">
                <div class="tt-buoc-dot active" id="ttDot1"></div>
                <div class="tt-buoc-dot" id="ttDot2"></div>
                <div class="tt-buoc-dot" id="ttDot3"></div>
            </div>

            <div class="tt-noi-dung">

                <!-- ======= BƯỚC 1: Xem lại đơn hàng ======= -->
                <div class="tt-buoc hien-buoc" id="ttBuoc1">
                    <div class="tt-don-hang">
                        <div class="tt-don-hang-tieu-de">📋 Đơn hàng của bạn</div>
                        <div id="ttDanhSachSP">
                            <!-- JS sẽ điền vào -->
                        </div>
                        <div class="tt-tong-dong">
                            <span>Tổng cộng</span>
                            <span id="ttTongTien1">0 VND</span>
                        </div>
                    </div>
                    <div class="tt-nut-hanh-dong">
                        <button class="tt-nut-phu" onclick="dongThanhToan()">← Quay lại</button>
                        <button class="tt-nut-chinh" onclick="ttChuyenBuoc(2)">Tiếp tục thanh toán →</button>
                    </div>
                </div>

                <!-- ======= BƯỚC 2: Quét QR / Chuyển khoản ======= -->
                <div class="tt-buoc" id="ttBuoc2">

                    <!-- Mã QR -->
                    <div class="tt-qr-khu">
                        <div class="tt-qr-khung">
                            <img id="ttAnhQR" src="${THONG_TIN_NGAN_HANG.anhQR}" alt="QR Chuyển khoản">
                        </div>
                        <div class="tt-qr-chu">📱 Quét mã bằng app ngân hàng bất kỳ</div>
                    </div>

                    <!-- Thông tin tài khoản -->
                    <div class="tt-tai-khoan">
                        <div class="tt-tai-khoan-dong">
                            <span class="nhan">🏦 Ngân hàng</span>
                            <span class="gia-tri">${THONG_TIN_NGAN_HANG.nganHang}</span>
                        </div>
                        ${THONG_TIN_NGAN_HANG.chiNhanh ? `
                        <div class="tt-tai-khoan-dong">
                            <span class="nhan">📍 Chi nhánh</span>
                            <span class="gia-tri">${THONG_TIN_NGAN_HANG.chiNhanh}</span>
                        </div>` : ''}
                        <div class="tt-tai-khoan-dong">
                            <span class="nhan">👤 Chủ TK</span>
                            <span class="gia-tri">${THONG_TIN_NGAN_HANG.chuTaiKhoan}</span>
                        </div>
                        <div class="tt-tai-khoan-dong">
                            <span class="nhan">💳 Số TK</span>
                            <span class="gia-tri" id="ttSoTK">${THONG_TIN_NGAN_HANG.soTaiKhoan}</span>
                            <button class="nut-sao-chep" id="nutSaoChep" onclick="saoCHepSoTK()">📋 Sao chép</button>
                        </div>
                        <div class="tt-tai-khoan-dong">
                            <span class="nhan">💰 Số tiền</span>
                            <span class="gia-tri" id="ttSoTienCK" style="color: #e53935;"></span>
                        </div>
                        <div class="tt-tai-khoan-dong">
                            <span class="nhan">📝 Nội dung</span>
                            <span class="gia-tri" id="ttNoiDungCK" style="color:#555; font-style:italic;"></span>
                        </div>
                    </div>

                    <div class="tt-nut-hanh-dong">
                        <button class="tt-nut-phu" onclick="ttChuyenBuoc(1)">← Quay lại</button>
                        <button class="tt-nut-chinh" onclick="ttChuyenBuoc(3)">Đã chuyển khoản →</button>
                    </div>
                </div>

                <!-- ======= BƯỚC 3: Tải ảnh xác nhận ======= -->
                <div class="tt-buoc" id="ttBuoc3">

                    <div class="tt-upload-khu">
                        <label>📸 Tải ảnh bill chuyển khoản lên để xác nhận</label>
                        <div class="tt-upload-vung" id="ttUploadVung">
                            <!-- Input file ẩn -->
                            <input type="file" id="tt-file-input" accept="image/*" onchange="xuLyAnh(event)">
                            <!-- Giao diện hiển thị -->
                            <div id="ttUploadGiaoThien">
                                <span class="tt-upload-bieu-tuong">🖼️</span>
                                <div class="tt-upload-chu">
                                    <strong>Nhấn vào đây</strong> để chọn ảnh bill<br>
                                    <small style="color:#aaa;">(JPG, PNG, v.v.)</small>
                                </div>
                            </div>
                            <!-- Ảnh xem trước -->
                            <img id="ttAnhXemTruoc" class="tt-anh-xem-truoc" alt="Ảnh bill">
                        </div>
                    </div>

                    <div class="tt-nut-hanh-dong">
                        <button class="tt-nut-phu" onclick="ttChuyenBuoc(2)">← Quay lại</button>
                        <button class="tt-nut-chinh" id="ttNutXacNhan" onclick="xacNhanThanhToan()" disabled>
                            ✅ Xác nhận thanh toán
                        </button>
                    </div>
                </div>

                <!-- ======= BƯỚC 4: Thành công ======= -->
                <div class="tt-buoc" id="ttBuoc4">
                    <div class="tt-thanh-cong">
                        <div class="tt-confetti-khu">🎉</div>
                        <h2>Chúc Mừng Bạn Đã Thanh<br>Toán Đơn Hàng Thành Công!</h2>
                        <p>Cảm ơn bạn đã mua sắm tại HotTea 🌿<br>Đơn hàng sẽ được xử lý sớm nhất có thể!</p>

                        <!-- Bill xác nhận -->
                        <div class="tt-bill" id="ttBillXacNhan">
                            <div class="tt-bill-tieu-de">🧾 HOÁ ĐƠN XÁC NHẬN</div>
                            <div id="ttBillChiTiet">
                                <!-- JS điền vào -->
                            </div>
                            <div class="tt-bill-tong">
                                <span>Tổng thanh toán</span>
                                <span id="ttBillTong" style="color:#e53935;"></span>
                            </div>
                            <!-- Ảnh bill người dùng đã tải -->
                            <img id="ttAnhBillXN" class="tt-anh-bill-xn" alt="Bill chuyển khoản">
                        </div>

                        <button class="tt-nut-ve" onclick="hoatDongThanhCong()">
                            🏠 Về trang chủ
                        </button>
                    </div>
                </div>

            </div><!-- /tt-noi-dung -->
        </div><!-- /tt-hop -->
    </div><!-- /tt-overlay -->
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('ttNutDong').addEventListener('click', dongThanhToan);
    document.getElementById('ttOverlay').addEventListener('click', function(e) {
        if (e.target === this) dongThanhToan(); 
    });
});



function moThanhToan() {

    const gioHang = JSON.parse(localStorage.getItem('gioHang')) || [];

    if (gioHang.length === 0) {
        hienThongBao('Giỏ hàng trống, hãy thêm sản phẩm trước! 🛒');
        return;
    }


    buocHienTai = 1;
    anhBillDaTai = null;

    let htmlSP = '';
    let tongTien = 0;

    gioHang.forEach(sp => {
        const thanhTien = sp.gia * sp.soLuong;
        tongTien += thanhTien;
        htmlSP += `
            <div class="tt-sp-dong">
                <span>${sp.ten} × ${sp.soLuong}</span>
                <span style="font-weight:600; color:#333;">${formatTienTT(thanhTien)}</span>
            </div>
        `;
    });

    document.getElementById('ttDanhSachSP').innerHTML = htmlSP;
    document.getElementById('ttTongTien1').textContent = formatTienTT(tongTien);

    document.getElementById('ttSoTienCK').textContent = formatTienTT(tongTien);

    const thoiGian = new Date();
    const maGD = 'HD' + thoiGian.getHours().toString().padStart(2,'0')
                       + thoiGian.getMinutes().toString().padStart(2,'0')
                       + thoiGian.getSeconds().toString().padStart(2,'0');
    document.getElementById('ttNoiDungCK').textContent = maGD + ' HotTea';

    capNhatChiBaoBuoc(1);
    hienBuoc(1);
    document.getElementById('ttOverlay').classList.add('hien');

    document.getElementById('ttAnhXemTruoc').style.display = 'none';
    document.getElementById('ttUploadGiaoThien').style.display = 'block';
    document.getElementById('ttUploadVung').classList.remove('co-anh');
    document.getElementById('ttNutXacNhan').disabled = true;
}



function ttChuyenBuoc(soBuoc) {
    buocHienTai = soBuoc;
    hienBuoc(soBuoc);
    capNhatChiBaoBuoc(soBuoc);
}

function hienBuoc(so) {

    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById('ttBuoc' + i);
        if (el) el.classList.remove('hien-buoc');
    }

    const buocHien = document.getElementById('ttBuoc' + so);
    if (buocHien) buocHien.classList.add('hien-buoc');
}

function capNhatChiBaoBuoc(buoc) {
    const chiBao = document.getElementById('ttChiBaoBuoc');
    if (!chiBao) return;

    chiBao.style.display = (buoc === 4) ? 'none' : 'flex';

    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById('ttDot' + i);
        if (!dot) continue;
        dot.className = 'tt-buoc-dot';
        if (i < buoc)  dot.classList.add('done');
        if (i === buoc) dot.classList.add('active');
    }
}



function xuLyAnh(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh (JPG, PNG, v.v.)!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        anhBillDaTai = e.target.result; 

        const anhXemTruoc = document.getElementById('ttAnhXemTruoc');
        anhXemTruoc.src = anhBillDaTai;
        anhXemTruoc.style.display = 'block';

        document.getElementById('ttUploadGiaoThien').style.display = 'none';
        document.getElementById('ttUploadVung').classList.add('co-anh');

        document.getElementById('ttNutXacNhan').disabled = false;
    };
    reader.readAsDataURL(file);
}



function xacNhanThanhToan() {
    if (!anhBillDaTai) {
        alert('Vui lòng tải ảnh bill chuyển khoản lên!');
        return;
    }

    const gioHang = JSON.parse(localStorage.getItem('gioHang')) || [];
    let tongTien = 0;
    let htmlBill = '';

    gioHang.forEach(sp => {
        const thanhTien = sp.gia * sp.soLuong;
        tongTien += thanhTien;
        htmlBill += `
            <div class="tt-bill-dong">
                <span>${sp.ten} × ${sp.soLuong}</span>
                <strong>${formatTienTT(thanhTien)}</strong>
            </div>
        `;
    });


    const thoiGian = new Date();
    const chuoiThoiGian = thoiGian.toLocaleString('vi-VN');

    htmlBill += `
        <div class="tt-bill-dong" style="margin-top:8px; padding-top:8px; border-top:1px dashed #c8e6c9;">
            <span>🕐 Thời gian</span>
            <strong style="font-size:12px;">${chuoiThoiGian}</strong>
        </div>
        <div class="tt-bill-dong">
            <span>🏦 Ngân hàng</span>
            <strong>${THONG_TIN_NGAN_HANG.nganHang}</strong>
        </div>
        <div class="tt-bill-dong">
            <span>👤 Người nhận</span>
            <strong>${THONG_TIN_NGAN_HANG.chuTaiKhoan}</strong>
        </div>
    `;

    document.getElementById('ttBillChiTiet').innerHTML = htmlBill;
    document.getElementById('ttBillTong').textContent = formatTienTT(tongTien);


    const anhBillXN = document.getElementById('ttAnhBillXN');
    anhBillXN.src = anhBillDaTai;
    anhBillXN.style.display = 'block';


    ttChuyenBuoc(4);

    localStorage.removeItem('gioHang');

    if (typeof capNhatHienThi === 'function') {
        capNhatHienThi();
    }
}
function dongThanhToan() {
    document.getElementById('ttOverlay').classList.remove('hien');
}


function saoCHepSoTK() {
    const soTK = THONG_TIN_NGAN_HANG.soTaiKhoan;
    navigator.clipboard.writeText(soTK).then(() => {
        const nut = document.getElementById('nutSaoChep');
        nut.textContent = '✓ Đã sao chép';
        nut.classList.add('da-sao-chep');
        setTimeout(() => {
            nut.textContent = '📋 Sao chép';
            nut.classList.remove('da-sao-chep');
        }, 2000);
    });
}

function hoatDongThanhCong() {
    dongThanhToan();

}


function formatTienTT(so) {
    return so.toLocaleString('vi-VN') + ' VND';
}


function thanhToan() {
    dongGioHang();         
    moThanhToan();          
}