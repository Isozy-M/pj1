function timkiem() {
    var tuKhoa = document.getElementById("ndtim").value.toLowerCase();
    var sanPham = document.getElementsByClassName("card");
    for (var i = 0; i < sanPham.length; i++) {
        var tenSanPham = sanPham[i].getElementsByTagName("h3")[0] .innerText.toLowerCase();
        if (tenSanPham.includes(tuKhoa)) {
            sanPham[i].style.display = "";
        } else {
            sanPham[i].style.display = "none";
        }
    }
}