let nameInput = document.getElementById("bookmarkName");
let urlInput = document.getElementById("WebsiteURL");
let tableData = document.getElementById("myTable");
let btnSubmit = document.getElementById("btn-submit")
let btnUpdate = document.getElementById("btn-update")
let modalWarning = bootstrap.Modal.getOrCreateInstance("#warning");
let modalDelete = bootstrap.Modal.getOrCreateInstance("#delete");
let myToast = bootstrap.Toast.getOrCreateInstance(document.getElementById("liveToast"))
let bookmarks = [];

if (localStorage.getItem("myData")) {
  bookmarks = JSON.parse(localStorage.getItem("myData"));
  displayBookmark();
}

function addBookmark() {
  if (btnSubmit.className.includes("warning")) {
    modalWarning.show();
  } else {
    let bookmarkContent = {
      bMsrkValue: nameInput.value,
      urlValue: urlInput.value,
    };
    if (bookmarkContent.urlValue.includes("https://") || bookmarkContent.urlValue.includes("http://")) {
      bookmarkContent.urlValue;
    } else {
      bookmarkContent.urlValue = "https://" + bookmarkContent.urlValue;
    }
    bookmarks.push(bookmarkContent);
    localStorage.setItem("myData", JSON.stringify(bookmarks));
    displayBookmark();
    (function () {
      document.getElementById("liveToast").innerHTML = `
    <div class="alert alert-success p-2 m-0 rounded-0 d-flex gap-1 align-items-center justify-content-center" role="alert">
      <i class="fa-solid fa-circle-check"></i>
      <p class="m-0">Your bookmark has been saved</p>
    </div>
      `
      myToast.show()
    })()
    clearData()
  }
}

function deleteBookmark(line) {
  modalDelete.show();
  document.getElementById("btn-del-index").setAttribute("onclick", `deleteIndex(${line})`)
  document.getElementById("neme-index").textContent = bookmarks[line].bMsrkValue
}
function deleteIndex(del) {    
  bookmarks.splice(del, 1);
  localStorage.setItem("myData", JSON.stringify(bookmarks));
  displayBookmark();
  (function () {
    document.getElementById("liveToast").innerHTML = `
    <div class="alert alert-danger p-2 m-0 rounded-0 d-flex gap-1 align-items-center justify-content-center" role="alert">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <p class="m-0">Your bookmark has been deleted</p>
    </div>
    `
    myToast.show()
  })()
  modalDelete.hide()
}

function displayBookmark() {
  let temp = "";

  for (let i = 0; i < bookmarks.length; i++) {
    temp += `
        <tr>
        <td>${[i + 1]}</td>
        <td>${bookmarks[i].bMsrkValue}</td>
        <td> <a href="${bookmarks[i].urlValue}" target="_blank"><button type="button" class="btn btn-visit"><i class="fa-regular fa-eye"></i><span class="ms-1">Visit</span></button></a> </td>
        <td><button type="button" onclick="updateBookmark(${[i]})" class="btn update"><i class="fa-regular fa-pen-to-square"></i><span class="ms-1">Edite</span></button></td>
        <td><button type="button" onclick="deleteBookmark(${[i,]})" class="btn btn-danger"><i class="fa-regular fa-trash-can"></i><span class="ms-1">Delete</span></button></td>
        </tr>
        `;
  }
  tableData.innerHTML = temp;
}

let updateValue;
function updateBookmark(line) {
  disableDelete()
    btnSubmit.style = "display: none;"
    btnUpdate.style = "display: inline-block;"
    nameInput.value = bookmarks[line].bMsrkValue
    urlInput.value = bookmarks[line].urlValue
    updateValue = line
    nameInput.focus()
}

function disableDelete() {
  let btnDelete = document.querySelectorAll("table .btn-danger")
  btnDelete.forEach((e) => {
    e.classList.add("disabled")
  })
}

function addUpdate() {
  checkData()
  if (btnSubmit.className.includes("warning")) {
      modalWarning.show();
    } else {
      let bookmarkContent = {
        bMsrkValue: nameInput.value,
        urlValue: urlInput.value,
      };
      if (bookmarkContent.urlValue.includes("https://") || bookmarkContent.urlValue.includes("http://")) {
        bookmarkContent.urlValue;
      } else {
        bookmarkContent.urlValue = "https://" + bookmarkContent.urlValue;
      }
      bookmarks[updateValue] = bookmarkContent
      localStorage.setItem("myData", JSON.stringify(bookmarks));
      displayBookmark();
    clearData();
    (function () {
      document.getElementById("liveToast").innerHTML = `
      <div class="alert alert-info p-2 m-0 rounded-0 d-flex gap-1 align-items-center justify-content-center" role="alert">
        <i class="fa-solid fa-circle-info"></i>
        <p class="m-0">Your bookmark has been updated</p>
      </div>
      `
      myToast.show()
    })()
      btnUpdate.style = "display: none;"
    btnSubmit.style = "display: inline-block;"
  }
}

btnUpdate.addEventListener("click", addUpdate)

nameInput.addEventListener("keyup", e =>{
  if (e.key == "Enter") {
    urlInput.focus()
  }
  if (nameInput.value.length < 3) {
    nameInput.classList.add("is-invalid");
  } else {
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
  }
  checkData();
});

function checkData() {
  if (urlInput.value == "" || nameInput.value == "") {
    btnSubmit.setAttribute("data-bs-target", "#warning");
    btnSubmit.classList.add("warning");
  } else if (
    nameInput.className.includes("is-invalid") || urlInput.className.includes("is-invalid")
  ) {
    btnSubmit.setAttribute("data-bs-target", "#warning");
    btnSubmit.classList.add("warning");
  } else {
    btnSubmit.removeAttribute("data-bs-target", "#warning");
    btnSubmit.classList.remove("warning");
  }
}

function checkUrl() {
  let rule = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9]{1,256}\.[a-z]{2,3}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  let result = urlInput.value.match(rule);
  if (result === null) {
    urlInput.classList.add("is-invalid");
  } else {
    urlInput.classList.remove("is-invalid");
    urlInput.classList.add("is-valid");
  }
  checkData();
}

urlInput.addEventListener("keyup", e => {
  checkUrl()
  if (e.key == "Enter") {
    if (btnUpdate.getAttribute("style") == "display: inline-block;") {
      addUpdate()
    } else {
      addBookmark()
    }
  }
} );
urlInput.addEventListener("change", checkUrl);
function clearData() {
  nameInput.value = "";
  urlInput.value = "";
  nameInput.classList.remove("is-valid");
  urlInput.classList.remove("is-valid");
  btnSubmit.classList.add("warning");
  nameInput.focus();
}

checkData();