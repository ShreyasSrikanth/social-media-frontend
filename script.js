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

async function displayData(post) {
    const itemList = document.createElement('ul');
    itemList.id = 'item-list';

    post.forEach(item => {
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

        commentButton.addEventListener('click', function() {
            const commentInput = document.createElement('input');
            commentInput.type = 'text';
            commentInput.placeholder = 'Enter your comment';

            const sendButton = document.createElement('button');
            sendButton.textContent = 'Send';

            sendButton.addEventListener('click', function() {
                const commentText = commentInput.value;
                // Process the commentText 
                console.log(commentText);
                 updateQuantity(item.id,commentText)
                // Remove the comment input and send button afterward
                listItem.removeChild(commentInput);
                listItem.removeChild(sendButton);
            });

            listItem.appendChild(commentInput);
            listItem.appendChild(sendButton);
        });

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
    });

    document.body.appendChild(itemList);
}


async function updateQuantity(id,comment){
    console.log(id,comment);
    await axios.post('http://localhost:4000/items/updateComment',{
        id:id,
        comment:comment,
        name:'Anonymous'
    })
}


fetchItems()
    .then(response => displayData(response))
    .catch(err => {
        console.log(err);
    });

async function addToExpress(e) {

    let url = document.getElementById('url').value;
    let caption = document.getElementById('caption').value;

    console.log(url);
    console.log(caption);

    try {
        const response = await axios.post('http://localhost:4000/items', {
            url: url,
            caption: caption
        });

        console.log("Response from POST:", response);

        alert("Data successfully Saved");

        document.getElementById('url').value = "";
        document.getElementById('caption').value = ""; 
        

        const newData = await fetchItems(); 
        console.log("New Data:", newData);
        displayData(newData);
    } catch (err) {
        console.log(err);
        alert("Failed to store data");
    }
}



