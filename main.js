const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("inputBook");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");

inputSearchBook.addEventListener("keyup", (e) => {
  e.preventDefault();
  searchBooks();
});

formSearchBook.addEventListener("submit", (e) => {
  e.preventDefault();
  searchBooks();
});

// cek webstorage
function isStorageExist() {
  if (typeof Storage === "undefined") {
    swal(
      "Upss",
      "Maaf, Browser anda tidak mendukung web storage. Silahkan gunakan Browser yang lainnya",
      "info"
    );
    return false;
  }
  return true;
}

// generate id buku
const generateId = () => +new Date();

// generate buku
const generateBookItem = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

// fungsi checkbox
function checkStatusBook() {
  const isCheckComplete = document.getElementById("inputBookIsComplete");
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

// tambahkan buku
function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = checkStatusBook();

  const id = generateId();
  const newBook = generateBookItem(
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted
  );

  books.unshift(newBook);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  swal("Berhasil", "Buku berhasil ditambahkan ke rak", "success");
}

// cari buku
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return null;
}

// hapus buku
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  swal({
    title: "Apakah Anda Yakin?",
    text: "Buku akan dihapus secara permanen!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();

      swal("Berhasil", "Satu buku sudah dihapus", "success");
    } else {
      swal("Buku batal dihapus");
    }
  });
}

// reset buku
function resetRak() {
  swal({
    title: "Apakah Anda Yakin?",
    text: "Semua buku akan dihapus secara permanen!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      books.splice(0, books.length);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();

      swal("Berhasil", "Semua buku berhasil dihapus", "success");
    } else {
      swal("Rak batal dikosongkan");
    }
  });
}

// mengubah status
function changeBookStatus(bookId) {
  const bookIndex = findBookIndex(bookId);
  for (const index in books) {
    if (index === bookIndex) {
      if (books[index].isCompleted === true) {
        books[index].isCompleted = false;
        swal(
          "Berhasil",
          "Buku dipindahkan ke rak belum selesai dibaca",
          "success"
        );
      } else {
        books[index].isCompleted = true;
        swal("Berhasil", "Buku dipindahkan ke rak selesai dibaca", "success");
      }
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// cari buku
function searchBooks() {
  const inputSearchValue = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const incompleteBookShelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookShelf = document.getElementById("completeBookshelfList");
  incompleteBookShelf.innerHTML = "";
  completeBookShelf.innerHTML = "";

  if (inputSearchValue == "") {
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
  }

  for (const book of books) {
    if (book.title.toLowerCase().includes(inputSearchValue)) {
      if (book.isCompleted == false) {
        let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>
               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Selesai di Baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="btn-orange" onclick="editBookData(${book.id})">Edit buku</button>
                  </div>
            </article>
            `;

        incompleteBookShelf.innerHTML += el;
      } else {
        let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>
               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Belum selesai di Baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="btn-orange" onclick="editBookData(${book.id})">Edit buku</button>
                  </div>
            </article>
            `;

        completeBookShelf.innerHTML += el;
      }
    }
  }
}

// edit buku
function editBookData(bookId) {
  const sectionEdit = document.querySelector(".input_edit_section");
  sectionEdit.style.display = "flex";
  const editTitle = document.getElementById("inputEditTitle");
  const editAuthor = document.getElementById("inputEditAuthor");
  const editYear = document.getElementById("inputEditYear");
  const formEditData = document.getElementById("editData");
  const cancelEdit = document.getElementById("bookEditCancel");
  const SubmitEdit = document.getElementById("bookEditSubmit");

  bookTarget = findBookIndex(bookId);

  // set old value
  editTitle.setAttribute("value", books[bookTarget].title);
  editAuthor.setAttribute("value", books[bookTarget].author);
  editYear.setAttribute("value", books[bookTarget].year);

  // update data
  SubmitEdit.addEventListener("click", (e) => {
    books[bookTarget].title = editTitle.value;
    books[bookTarget].author = editAuthor.value;
    books[bookTarget].year = editYear.value;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    formEditData.reset();
    sectionEdit.style.display = "none";
    swal("Berhasil", "Data bukumu sudah berhasil diedit", "success");
  });

  cancelEdit.addEventListener("click", (e) => {
    e.preventDefault();
    sectionEdit.style.display = "none";
    formEditData.reset();
    swal("Anda membatalkan untuk mengedit data buku");
  });
}

// save data to local storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// load data from storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    data.forEach((book) => {
      books.unshift(book);
    });
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  return books;
}

// tampilkan
function showBook(books = []) {
  const incompleteBookShelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookShelf = document.getElementById("completeBookshelfList");

  incompleteBookShelf.innerHTML = "";
  completeBookShelf.innerHTML = "";

  books.forEach((book) => {
    if (book.isCompleted == false) {
      let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>
               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Tandai Selesai</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus</button>
                  <button class="btn-orange" onclick="editBookData(${book.id})">Edit</button>
               </div>
            </article>
            `;

      incompleteBookShelf.innerHTML += el;
    } else {
      let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>
               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Reset</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus</button>
                  <button class="btn-orange" onclick="editBookData(${book.id})">Edit</button>
                  </div>
            </article>
            `;

      completeBookShelf.innerHTML += el;
    }
  });
}

// content loaded & submit form
document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();

    form.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// render event addeventlistener
document.addEventListener(RENDER_EVENT, () => {
  const btnResetRak = document.getElementById("resetRak");
  if (books.length <= 0) {
    btnResetRak.style.display = "none";
  } else {
    btnResetRak.style.display = "block";
  }

  showBook(books);
});
