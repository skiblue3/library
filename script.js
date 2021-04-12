// loads up the library from local storage
let myLibrary = JSON.parse(localStorage.getItem("array") || "[]");

const main = document.querySelector('main');
displayBooks();

function populateStorage() {
    localStorage.setItem('array', JSON.stringify(myLibrary));
}

// Constructor for Books
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    // this.info = () => `${title} by ${author}, ${pages} pages, ${read ? 'read' : 'not read yet'}`; 
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function displayBooks() {
    // to clear the cards
    document.querySelectorAll('.grid').forEach(div => div.remove());

    // determines number of rows required with 4 columns
    let rows = (myLibrary.length % 4 == 0) ? myLibrary.length/4 : Math.floor(myLibrary.length / 4) + 1;
    main.style.display = (rows == 0) ? 'none' : 'grid';

    // to display each book by iterating over array
    for (let i = 0; i < myLibrary.length; i++) {
        const div = document.createElement('div');
        div.classList.add('grid');
        div.setAttribute('id', i);

        const ul = document.createElement('ul');
        for (let key in myLibrary[i]) { 
            const li = document.createElement('li');
            li.classList.add(key);
            if (key == 'read') {
                const label = document.createElement('label');
                label.setAttribute('for', 'read');
                label.innerText = 'Read: ';
                li.appendChild(label);

                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('data-key', i);
                checkbox.classList.add('read-check');
                checkbox.checked = myLibrary[i][key];
                li.appendChild(checkbox);

                li.classList.add('read-div');
                ul.appendChild(li);
                continue;
            } else if (key == 'pages') {
                li.innerText = `Pages: ${myLibrary[i][key]}`;
            } else {
                li.innerText = myLibrary[i][key];
            }
            ul.appendChild(li);
        }

        const button = document.createElement('button');
        button.classList.add('delete');
        button.innerText = 'Delete';
        button.setAttribute('data-key', i);

        ul.appendChild(button);
        div.appendChild(ul);
        main.appendChild(div);
    }
    main.style.gridTemplateColumns = `repeat(4, 1fr)`;
    main.style.gridTemplateRows = `repeat(${rows}, 210px)`;

    // for deleting a book from library
    document.querySelectorAll('.delete').forEach(del => {
        del.addEventListener('click', () => {
            let flag = confirm("Are you sure you want to delete this?");
            if (!flag)
                return;
            const index = +del.getAttribute('data-key');
            myLibrary.splice(index, 1);
            displayBooks();
        });
    });

    // for toggling the read value of a book
    document.querySelectorAll('.read-check').forEach(check => {
        check.addEventListener('click', () => {
            const index = check.getAttribute('data-key');
            myLibrary[index]['read'] = check.checked;
            populateStorage();  // to update the read value in local storage
        });
    });

    // populates storage everytime it calls this function
    populateStorage();
}

// displays a pop-up clean form
document.querySelector('#newBook').addEventListener('click', () => {
    document.querySelector('.form').classList.add('show-form');
    const form = document.querySelector('form');
    form.reset();
});

// to submit or clear the form
document.querySelectorAll('.form-buttons').forEach(btn => {
    btn.addEventListener('click', () => {
        // submit the form and extracts the values from form
        if (btn.getAttribute('id') == 'submit') {
            const form = document.querySelector('form');
            let book = new Book();
            for (let i in form.elements) {
                let element = form.elements[i];
                switch (element.id) {
                    case 'title':
                    case 'author':
                    case 'pages':
                        if (element.value == '') {
                            alert(`${element.id} can't be empty`);
                            return;
                        } 
                        book[element.id] = (element.id == 'pages')? element.valueAsNumber: element.value;
                        break;
                    case 'read':
                        book[element.id] = element.checked;
                        break;
                }
            }
            addBookToLibrary(book);
            displayBooks();
        }
        document.querySelector('.form').classList.remove('show-form'); // closes the form
    }); 
});
