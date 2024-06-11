// All variable Declaration
let mainCounter = 0;
let total = 0.00;
let quantity = 0;
const cartItems = {}; // Object to track items and their quantities

function truncateTitle(title, wordLimit) {
    let words = title.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return title;
}

// Receive Data
const render = document.querySelector('.root');
const getData = async function() {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    if (data !== null && data !== undefined)
        return data;
}

// DOM Handle
let receivedData;
getData().then(data => {
    receivedData = data;
    receivedData.forEach((e, index) => {
        let div = document.createElement('div');
        let images = document.createElement("img");
        let title = document.createElement("p");
        let price = document.createElement('p');
        let button = document.createElement('button');
        title.setAttribute("class", "title");
        title.innerHTML = truncateTitle(e.title, 15);
        price.setAttribute("class", "price");
        price.innerText = `Price: $${e.price}`;
        button.setAttribute("class", "add");
        button.innerHTML = "Add to Cart";
        images.setAttribute("src", e.image);
        images.setAttribute("class", "items-img");
        div.appendChild(images);
        div.appendChild(title);
        div.appendChild(price);
        div.appendChild(button);
        div.setAttribute("class", "Item");
        render.appendChild(div);
    });

    // Target Elements
    let sideBar = document.querySelector('#sidebar');
    let mainC = document.getElementById("count");
    let empty = document.getElementById('emptyText');
    let totalPrice = document.getElementById('Total');

    // Add to cart Buttons
    const buttons = document.querySelectorAll('.add');
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', e => {
            mainCounter++;
            total += receivedData[index].price;
            mainC.innerHTML = mainCounter;
            if (mainCounter > 0)
                empty.innerHTML = "";
            totalPrice.innerHTML = `$${total.toFixed(2)}`;
            
            // Check if item already exists in cart
            if (cartItems[index]) {
                cartItems[index].quantity++;
                cartItems[index].element.querySelector('.item-quantity').innerText = `Qtt: ${cartItems[index].quantity}`;
            } else {
                cartItems[index] = {
                    quantity: 1,
                    element: document.createElement("div")
                };
                let addInCartElement = cartItems[index].element;
                addInCartElement.setAttribute("class", "cartitems");
                addInCartElement.innerHTML = `
                    <img src="${receivedData[index].image}" style="width: 40px; height: 30px; border-radius: 10px; display: flex;">
                    <p class="cartTitle">${truncateTitle(receivedData[index].title, 15)}</p>
                    <p class="cart-price">$${receivedData[index].price}</p>
                    <p class="item-quantity">Qtt: 1</p>
                    <button class="fa-solid fa-trash delete" data-index="${index}"></button>`;
                sideBar.appendChild(addInCartElement);

                // Add remove functionality to the new delete button
                addInCartElement.querySelector('.delete').addEventListener('click', function(e) {
                    let itemIndex = e.target.getAttribute('data-index');
                    mainCounter -= cartItems[itemIndex].quantity;
                    total -= receivedData[itemIndex].price * cartItems[itemIndex].quantity;
                    mainC.innerHTML = mainCounter;
                    if (mainCounter === 0)
                        empty.innerHTML = "Cart is empty";
                    totalPrice.innerHTML = `$${total.toFixed(2)}`;
                    sideBar.removeChild(addInCartElement);
                    delete cartItems[itemIndex];
                });
            }
        });
    });
});
