//* Cms -> Content Management System

const data = {
  users: [],
  products: [],
};
//=======================================================Dom Element=====================================
const toggleMenu = document.querySelector(".toggle-sidebar");
const RemoveProductModal = document.querySelector("#Remove-Product-Modal");
const RemoveUserModal = document.querySelector("#Remove-user-modal");
const removesBtns = document.querySelector(".remove-btn");
const ProductEditModal = document.querySelector("#Product-Edit-Modal");
const editBtns = document.querySelectorAll(".edit-btn");
const createProductBtn =document.querySelector("#create-product");
const createProductModal = document.querySelector("#Product-create-Modal");
const closeModal =document.querySelectorAll(".close-modal");
const cancelBtns =document.querySelectorAll(".cancel");
const tableBody =document.querySelector("#table-body-for-product");
const productsDataLength =document.querySelectorAll(".products-data")
const submitAddProductBtn = document.querySelector("#submit-Add-Product-Btn");
const confirmRemoveBtn = document.querySelector("#confirm-remove");
const submitEditBtn =document.querySelector("#submit-edit");
const themeButton = document.querySelector(".theme-button");
const html = document.documentElement;
const productTable = document.querySelector("#table-body-for-product-page1");
const createUser =document.querySelector("#create-user");
const createUserModal = document.querySelector("#create-user-modal");
const submitCreatUser =document.querySelector("#submit-creat-user");
const tableBodyForUsers = document.querySelector("#table-body-for-users");
const userEditModal =document.querySelector("#user-Edit-Modal");
const submitRemove = document.querySelectorAll("#submit-Remove"); //
const submitUserEdit = document.querySelector("#submit-user-edit"); 
const savedTheme = localStorage.getItem("theme");
const latestUsersTable = document.querySelector(".latest-users");
//===============================================================================================================

if (savedTheme === "dark") {
  html.classList.add("dark");
}


themeButton.addEventListener("click", () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

//==========================================flag================================================================
let productToRemove = null 
let UserToRemove = null 
//=========================================== toggleMenu =======================================================

toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

//============================================= function ======================================================

function renderProductsTable(targetElement, productsArray) {
  if (!targetElement) return;

  targetElement.innerHTML = '';
  productsArray.forEach((product) => {
    const row = document.createElement('tr');
    row.classList.add('tableRow');
    row.innerHTML = `
      <td class="product-title">${product.title}</td>
      <td class="product-price">${product.price.toLocaleString()}</td>
      <td class="product-shortName">${product.slug}</td>
      <td class="product-manage">
        <button class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button class="remove-btn" data-id="${product.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    targetElement.appendChild(row);
  });

  // وصل کردن دکمه‌های ویرایش
  const editBtns = targetElement.querySelectorAll(".edit-btn");
  editBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const product = productsArray[index];
      document.querySelector("#product-id-edit").value = product.id;
      document.querySelector("#product-title-edit").value = product.title;
      document.querySelector("#product-price-edit").value = product.price;
      document.querySelector("#product-shortName-edit").value = product.slug;
      ProductEditModal.classList.remove("hidden");
    });
  });

  // وصل کردن دکمه‌های حذف
  const removeBtns = targetElement.querySelectorAll(".remove-btn");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      productToRemove = Number(btn.dataset.id);
      RemoveProductModal.classList.remove("hidden");
    });
  });
}


function productsDataLengthF() {
  productsDataLength.forEach((el) => {
    el.textContent = data.products.length;
  });
};

function attachProductButtons() {
  const editBtns = document.querySelectorAll(".edit-btn");
  const removesBtns = document.querySelectorAll(".remove-btn");

  editBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const product = data.products[index]; // محصول مورد نظر
      // مقداردهی به inputها
      document.querySelector("#product-id-edit").value = product.id;
      document.querySelector("#product-title-edit").value = product.title;
      document.querySelector("#product-price-edit").value = product.price;
      document.querySelector("#product-shortName-edit").value = product.slug;

      ProductEditModal.classList.remove("hidden");
    });
  });

  removesBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      productToRemove = Number(btn.dataset.id); // تبدیل به عدد
      RemoveProductModal.classList.remove("hidden");
   
    });
  });
}

function ShowCreatModal(){
  createProductModal.classList.remove("hidden")
};

function hidModal() {
  const modals = [createProductModal, RemoveProductModal, ProductEditModal , createUserModal , userEditModal , RemoveUserModal ];
  modals.forEach(modal => {
    if (modal && !modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
    }
  });
};

function AddProduct(event){
  event.preventDefault(); // جلوی رفرش صفحه

  const productTitle = document.querySelector("#product-title-add");
  const productPrice = document.querySelector("#product-price-add");
  const productShortName = document.querySelector("#product-shortName-add");

  const newProduct = {
      id: data.products.length + 1,
      title: productTitle.value,
      price: productPrice.value,
      slug: productShortName.value
  };

  data.products.push(newProduct);



  // خالی کردن input‌ها
  productTitle.value = "";
  productPrice.value = "";
  productShortName.value = "";

  hidModal()// بستن مودال
renderProductsTable(tableBody, data.products);
productsDataLengthF()
  saveInLocalStorage()
  showToast("success", "محصول با موفقیت اضافه شد");
};

function saveInLocalStorage(){
  localStorage.setItem("products", JSON.stringify(data.products));
  localStorage.setItem("User", JSON.stringify(data.users));

};

function getFromLocalStorage(){
  const savedUser =localStorage.getItem("User");
  const savedProducts = localStorage.getItem("products");
if (savedProducts) {
  data.products = JSON.parse(savedProducts);
  renderProductsTable(tableBody, data.products);
renderProductsTable(productTable, data.products.slice(-5));
  productsDataLengthF()
}
if(savedUser){
  data.users =JSON.parse(savedUser);
  renderuserTable(tableBodyForUsers, data.users)
  latestUsers()
}
};

function removeProduct() {
  if (productToRemove) {
    data.products = data.products.filter(p => p.id != Number(productToRemove));
    saveInLocalStorage();
   renderProductsTable(tableBody, data.products);
renderProductsTable(productTable, data.products.slice(-5));
    hidModal();
    showToast("error", "محصول با موفقیت حذف شد");
    // بعد از افزودن، ویرایش یا حذف محصول
productsDataLengthF()



  }
};

function editProduct(e){
  const id = Number(document.querySelector("#product-id-edit").value);
  const title = document.querySelector("#product-title-edit").value.trim();
  const price = Number(document.querySelector("#product-price-edit").value.trim());
  const slug = document.querySelector("#product-shortName-edit").value.trim();

  const index = data.products.findIndex(p => p.id === id);
  if (index === -1) return;

  data.products[index] = { id, title, price, slug };

  saveInLocalStorage();
  renderProductsTable(tableBody, data.products);
  renderProductsTable(productTable, data.products.slice(-5));
  hidModal();
  
    showToast("edit", "محصول با موفقیت ویرایش شد");

};

function showToast(type, message) {
  const toast = document.querySelector("#toast");
  const content = toast.querySelector(".toast-content");
  const icon = toast.querySelector(".icon-card");
  const process = toast.querySelector(".process");

  // رنگ‌ها
  const colors = {
    success: "#2ecc71", // سبز
    error: "#e74c3c",   // قرمز
    edit: "#f1c40f"     // زرد
  };

  // متن
  content.textContent = message;

  // رنگ دادن فقط به آیکون و نوار
  icon.style.background = colors[type];
  process.style.background = colors[type];

  // نمایش
  toast.classList.remove("hidden");

  // ریست انیمیشن نوار
  process.style.animation = "none";
  void process.offsetWidth;
  process.style.animation = null;

  // مخفی‌سازی
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2700);
};

function showUserModal(){
createUserModal.classList.remove("hidden");
};

 function addUser(event){
 event.preventDefault(); // جلوی رفرش صفحه
 
 
  const userTitle = document.querySelector("#user-title-add");
  const userName = document.querySelector("#user-Name-add");
  const userEmail= document.querySelector("#user-Email-add");
  const password = document.querySelector("#user-password-add");
  
  const newUser = {
      id: data.users.length + 1,
      name: userTitle.value,
      username: userName.value,
      email: userEmail.value,
      password: password.value,
  };
  data.users.push(newUser);

    // خالی کردن input‌ها
  userTitle.value = "";
  userName.value = "";
  userEmail.value = "";
  password.value = "";

   hidModal();// بستن مودال;
     saveInLocalStorage();
      renderuserTable(tableBodyForUsers, data.users)
 showToast("success", "محصول با موفقیت اضافه شد");
userDataLength()

};

function renderuserTable(targetElement, usersArray){
  if (!targetElement) return;

  targetElement.innerHTML = '';

  usersArray.forEach((user) => {
    const row = document.createElement('tr');
    row.classList.add('tableRow');

    row.innerHTML = `
      <td class="user-fullName">${user.name}</td>
      <td class="user-username">${user.username}</td>
      <td class="user-email">${user.email}</td>
      <td class="user-password">${user.password}</td>
      <td class="product-manage">
        <button class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button class="remove-btn" data-id="${user.id}">
          <i class="fas fa-ban"></i>
        </button>
      </td>
    `;

    targetElement.appendChild(row);
  });

  userDataLength();
  
}

if(tableBodyForUsers){
  tableBodyForUsers.addEventListener("click", (e) => {

    const removeBtn = e.target.closest(".remove-btn");
    const editBtn = e.target.closest(".edit-btn");

    if(removeBtn){
      UserToRemove = Number(removeBtn.dataset.id);
      
      RemoveUserModal.classList.remove("hidden");
    }

    if(editBtn){
      const index = [...tableBodyForUsers.querySelectorAll(".edit-btn")].indexOf(editBtn);
      const user = data.users[index];

      document.querySelector("#user-id-edit").value = user.id;
      document.querySelector("#user-fullName").value = user.name;
      document.querySelector("#user-username").value = user.username;
      document.querySelector("#user-email").value = user.email;
      document.querySelector("#user-password").value = user.password;

      userEditModal.classList.remove("hidden");
    }
  });
}

if(tableBodyForUsers){
  tableBodyForUsers.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-btn");
  const editBtn = e.target.closest(".edit-btn");

  if(removeBtn){
    UserToRemove = Number(removeBtn.dataset.id);
    RemoveUserModal.classList.remove("hidden");
  }

  if(editBtn){
    const index = [...tableBodyForUsers.querySelectorAll(".edit-btn")].indexOf(editBtn);
    const user = data.users[index];

    document.querySelector("#user-id-edit").value = user.id;
    document.querySelector("#user-fullName").value = user.name;
    document.querySelector("#user-username").value = user.username;
    document.querySelector("#user-password").value = user.password;
    document.querySelector("#user-email").value = user.email;

    userEditModal.classList.remove("hidden");
  }
});
};

function editUser(e){

  const id = Number(document.querySelector("#user-id-edit").value);
  const name = document.querySelector("#user-fullName").value;
  const email =document.querySelector("#user-email").value.trim(); 
   const username = document.querySelector("#user-username").value.trim();
  const password = document.querySelector("#user-password").value.trim();

  const index = data.users.findIndex(p => p.id === id);
  if (index === -1) return;

  data.users[index] = { id, name , username, email, password };

  saveInLocalStorage();
   renderuserTable(tableBodyForUsers, data.users);
   hidModal();
    showToast("edit", "محصول با موفقیت ویرایش شد");

  
};

function RemoveUser(){

  if (UserToRemove) {
    // فیلتر کردن کاربران به جز کاربری که میخوای حذف کنی
    data.users = data.users.filter(user => user.id !== Number(UserToRemove));

    // ذخیره در لوکال استوریج
    saveInLocalStorage();

    // رندر مجدد جدول کاربران
    renderuserTable(tableBodyForUsers, data.users);

    // بستن مودال
    hidModal();

    // نمایش پیام موفقیت
    showToast("error", "کاربر با موفقیت حذف شد");

    // ریست کردن UserToRemove
    UserToRemove = null;
  }
};

function userDataLength(){
  const usersData = document.querySelector(".users-data");
  console.log(usersData)
 usersData.textContent = data.users.length;
};
function latestUsers() {
  const container = document.querySelector(".latest-users-list");
  if (!container) return;

  container.innerHTML = ''; // فقط articleها پاک میشه، لینک دست نخورده

  const lastUsers = data.users.slice(-5);

  lastUsers.forEach(user => {
    container.insertAdjacentHTML("beforeend", `
      <article>
        <span class="icon-card">
          <i class="fa-solid fa-user"></i>
        </span>
        <div>
          <p class="user-name">${user.name}</p>
          <p class="user-email">${user.email}</p>
        </div>
      </article>
    `);
  });
  userDataLength()
}

//================================================ if ===========================================================
if(submitRemove){
  submitRemove.forEach(function(submit){
    submit.addEventListener("click", RemoveUser);
  })
};

if (closeModal.length) {
  closeModal.forEach(function(close){
    close.addEventListener("click", hidModal)
    
  });
};

if (createProductBtn) {
  createProductBtn.addEventListener("click", ShowCreatModal);
};

if (cancelBtns) {
  cancelBtns.forEach(function(cancelBtn){
    cancelBtn.addEventListener("click", hidModal)
  })
};

if(submitAddProductBtn) {
  submitAddProductBtn.addEventListener("click", AddProduct);
};

if(confirmRemoveBtn){
  confirmRemoveBtn.addEventListener("click", removeProduct);
};

if(createUser){
  createUser.addEventListener("click" ,  showUserModal) 
};

if(submitEditBtn){
  submitEditBtn.addEventListener("click" , editProduct)
};

if(submitCreatUser){
  submitCreatUser.addEventListener("click", addUser)
};

if(submitUserEdit){
  submitUserEdit.addEventListener("click", editUser);
}



//============================================================================================================


getFromLocalStorage()






