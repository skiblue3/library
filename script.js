const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const theHobbit2 = new Book('The Hobbit2', 'J.R.R. Tolkien', 295, true);

let myLibrary = [theHobbit, theHobbit2, theHobbit, theHobbit, theHobbit];  // array to store books

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
    document.querySelectorAll('.grid').forEach(div => div.remove());

    let rows = (myLibrary.length % 4 == 0) ? myLibrary.length/4 : Math.floor(myLibrary.length / 4) + 1;
    if (rows == 0) {
        main.style.display = 'none';
    } else {
        main.style.display = 'grid';
    }
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

    document.querySelectorAll('.read-check').forEach(check => {
        check.addEventListener('click', () => {
            const index = check.getAttribute('data-key');
            myLibrary[index]['read'] = check.checked;
        });
    });
}

document.querySelector('#newBook').addEventListener('click', () => {
    document.querySelector('.form').classList.add('show-form');2
    const form = document.querySelector('form');
    form.reset();
});

document.querySelectorAll('.form-buttons').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.getAttribute('id') == 'submit') {
            const form = document.querySelector('form');
            let book = new Book();
            for (let i in form.elements) {
                console.log(form.elements[i]);
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
        document.querySelector('.form').classList.remove('show-form');
    }); 
});

const main = document.querySelector('main');
displayBooks();
