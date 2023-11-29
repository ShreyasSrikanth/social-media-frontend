const form = document.getElementById('form-data');

form.addEventListener('submit', addToExpress);

async function fetchItems() {
    try {
        const response = await axios.get('http://localhost:4000/itemDetails');
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function fetchComments(id) {
    try {
        const response = await axios.get(`http://localhost:4000/comments/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function displayData(post) {
    const itemList = document.createElement('ul');
    itemList.id = 'item-list';

    for (const item of post) {
        const listItem = document.createElement('li');
        listItem.classList.add('item');

        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.imageCaption;
        image.style.width = '-webkit-fill-available';
        image.style.height = 'auto';

        const caption = document.createElement('p');
        caption.textContent = item.imageCaption;

        const commentButton = document.createElement('button');
        commentButton.textContent = 'Comment';

        listItem.style.background = 'lightblue';
        listItem.style.textAlign = 'center';
        listItem.style.padding = '20px';
        listItem.style.marginBottom = '20px';
        listItem.style.maxWidth = '400px';

        itemList.style.listStyle = 'none';
        itemList.style.margin = 'auto';
        itemList.style.width = 'fit-content';

        listItem.appendChild(image);
        listItem.appendChild(caption);
        listItem.appendChild(commentButton);

        itemList.appendChild(listItem);

        commentButton.addEventListener('click', async function (e) {
            e.preventDefault();

            const listItem = this.parentElement;
            let commentInput = listItem.querySelector('.comment-input');
            let sendButton = listItem.querySelector('.send-button');

            if (!commentInput && !sendButton) {
                commentInput = document.createElement('input');
                commentInput.type = 'text';
                commentInput.placeholder = 'Enter your comment';
                commentInput.classList.add('comment-input');

                sendButton = document.createElement('button');
                sendButton.textContent = 'Send';
                sendButton.classList.add('send-button');

                sendButton.addEventListener('click', async function (e) {
                    e.preventDefault();
                    const commentText = commentInput.value;
                    await updateQuantity(item.id, commentText);
                    commentInput.value = '';

                    try {
                        const comment = await fetchComments(item.id);
                        displayComments(comment, listItem, true);
                    } catch (error) {
                        console.log(error);
                    }
                });

                

                listItem.appendChild(commentInput);
                listItem.appendChild(sendButton);

                const commentsContainer = document.createElement('div');
                commentsContainer.classList.add('comments-container');
                listItem.appendChild(commentsContainer);
            }

            try {
                const comment = await fetchComments(item.id);
                displayComments(comment, listItem, false);
            } catch (error) {
                console.log(error);
            }
        });
    }

    document.body.appendChild(itemList);
}


async function updateQuantity(id, comment) {
    try {
        await axios.post('http://localhost:4000/items/updateComment', {
            id: id,
            comment: comment,
            name: 'Anonymous'
        });
    } catch (err) {
        console.log(err);
    }
}

function displayComments(comments, listItem, shouldDisplayComments) {
    let commentsContainer = listItem.querySelector('.comments-container');

    if (!commentsContainer) {
        commentsContainer = document.createElement('div');
        commentsContainer.classList.add('comments-container');
        listItem.appendChild(commentsContainer);
    } else {
        commentsContainer.innerHTML = '';
    }

    comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = comment.name + ' = ' + comment.comments;
        commentsContainer.appendChild(commentElement);
    });

    if (shouldDisplayComments && !listItem.contains(commentsContainer)) {
        listItem.appendChild(commentsContainer);
    }
}

async function addToExpress() {
   
    let url = document.getElementById('url').value;
    let caption = document.getElementById('caption').value;

    try {
        const response = await axios.post('http://localhost:4000/items', {
            url: url,
            caption: caption
        });

        alert("Data successfully Saved");

        document.getElementById('url').value = "";
        document.getElementById('caption').value = "";

        const newData = await fetchItems();
        displayData(newData);
    } catch (err) {
        console.log(err);
        alert("Failed to store data");
    }
}

fetchItems()
    .then(response => displayData(response))
    .catch(err => {
        console.log(err);
    });
