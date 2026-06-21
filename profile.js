let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if(currentUser == null){
    location.href = "dki.html";
}

  document.getElementById("ho").innerText = currentUser.ho;
  document.getElementById("ten").innerText = currentUser.ten;
  document.getElementById("sdt").innerText = currentUser.sdt;
  document.getElementById("email").innerText = currentUser.email;

  let nutDangXuat = document.getElementById("dangxuat");

 nutDangXuat.onclick = dangXuat;

function dangXuat(){

    localStorage.removeItem("currentUser");

    alert("Đăng xuất thành công 🎉");

    location.href = "index.html";
}