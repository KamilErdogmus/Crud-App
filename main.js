const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
const alert = document.querySelector(".alert");

// Düzenleme Seçenekleri

let editElement;
let editFlag = false; //* Düzenleme modunda olup olmadığını belirtir.
let editID = ""; //* Düzenleme yapılan öğenin benzersiz kimliği

const SetBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
// Tıkladığımız article etiketini ekrandan kaldıracak fonskiyondur
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //* Article etiketine eriştik
  const id = element.dataset.id;
  list.removeChild(element); //* List etiketinden article etiketini kaldırdık.
  displayAlert("Öğe kaldırıldı", "danger");
  SetBackToDefault();
  removeFromLocalStorage(id);
};

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //*article etiketine parent elementine eriştik
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //Tıkladığım article etiketi içerisindeki p etiketinin textini inputun içerisine gönderme
  grocery.value = editElement.textContent;
  editFlag = true;
  submitBtn.textContent = "Düzenle"; //Submit-btn içeriği düzenlendi
  editID = element.dataset.id; //* Düzenlenen öğenin kimliğine erişme
};

form.addEventListener("submit", (e) => {
  e.preventDefault(); //*Formun otomatik olarak gönderilmesini engeller.
  const value = grocery.value; //* Form içerisinde bulunan bir inputun değerini aldık.
  const id = new Date().getTime().toString(); //* Benzersiz bir id oluşturduk.

  //Eğer input boş değilse ve düzenleme modunda değilse çalışacak blok
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //Yeni article etiketi oluşturduk
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr); // Oluşturduğumuz id yi article etiketine ekledik
    element.classList.add("grocery-item");
    element.innerHTML = `

           <p class="title">${value}</p>
            <div class="btn-container">
              <button type="submit" class="edit-btn">
                <i class="fas fa-pen-to-square"></i>
              </button>
              <button type="submit" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
      
  `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // kapsayıcıya oluşturduğumuz article etiketini ekledik
    list.appendChild(element);

    displayAlert("Başarıyla Eklendi.", "success");

    addToLocalStorage(id, value);

    container.classList.add("show-container");
    SetBackToDefault();
  } else if (value !== "" && editFlag) {
    // Değiştireceğimiz p etiketinin içerik kısmına kullanıcının inputa girdiği değeri gönderdik
    editElement.textContent = value;
    // Ekrana Alert Bastırdık
    displayAlert("Değer Değiştirildi.", "success");
    editLocalStorage(editID, value);
    SetBackToDefault();
  }
});
clearBtn.addEventListener("click", () => {
  const items = document.querySelectorAll(".grocery-item");
  // Listede öğe varsa çalışır
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  //   Container yapısını gizler
  container.classList.remove("show-container");
  displayAlert("Liste Boş!", "danger");
  SetBackToDefault();
  clearLocalStorage();
});

const addToLocalStorage = (id, value) => {
  const grocery = {
    id,
    value,
  };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

const createListItem = (id, value) => {
  const element = document.createElement("article"); //Yeni article etiketi oluşturduk
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr); // Oluşturduğumuz id yi article etiketine ekledik
  element.classList.add("grocery-item");
  element.innerHTML = `

           <p class="title">${value}</p>
            <div class="btn-container">
              <button type="submit" class="edit-btn">
                <i class="fas fa-pen-to-square"></i>
              </button>
              <button type="submit" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
      
  `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // kapsayıcıya oluşturduğumuz article etiketini ekledik
  list.appendChild(element);
  container.classList.add("show-container");
};

const removeFromLocalStorage = (id) => {
  // localStorageda bulunan verileri getir
  let items = getLocalStorage();
  // tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};
window.addEventListener("DOMContentLoaded", setupItems);

// Yerel depoda update işlemi
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  // yerel depodaki verilerin id ile güncellenecek olan verinin idsi biribirne eşit ise inputa girilen value değişkenini al
  // localStorageda bulunan verinin valuesuna aktar
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

// Clear-Btn ye bastığında local storageyi silme
const clearLocalStorage = () => {
  localStorage.removeItem("list");
};
