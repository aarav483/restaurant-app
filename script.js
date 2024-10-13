const apiUrl = "https://crudcrud.com/api/a8dfb429fad44cc9933b6c0386aec025/data";

// On page load, fetch and display the orders
window.addEventListener('DOMContentLoaded', fetchAndDisplayOrders);

// Form submission handler
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const price = document.getElementById('price').value;
    const dish = document.getElementById('dish').value;
    const table = document.getElementById('table').value;

    if (price && dish && table) {
        const order = { price, dish, table };
        addOrder(order);
    }
});

// Function to add an order (POST request)
async function addOrder(order) {
    try {
        // POST request to add the order
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        const data = await response.json();
        
        // Save to local storage
        saveToLocalStorage(data);
        
        // Display the order
        displayOrder(data);
    } catch (error) {
        console.error('Error adding order:', error);
    }
}

// Function to fetch and display orders (GET request)
async function fetchAndDisplayOrders() {
    try {
        const response = await fetch(apiUrl);
        const orders = await response.json();
        
        // Clear existing orders
        clearOrderLists();

        // Display each order
        orders.forEach(order => {
            displayOrder(order);
            saveToLocalStorage(order);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Function to display an order
function displayOrder(order) {
    // Determine the correct list for the table
    const orderListId = order.table.toLowerCase().replace(' ', '') + 'Orders';
    const orderList = document.getElementById(orderListId);

    // Create a new list item for the order
    const listItem = document.createElement('li');
    listItem.textContent = `Price: ${order.price} - Dish: ${order.dish}`;
    listItem.id = order._id;

    // Create a delete button for the order
    const deleteButton = document.createElement('span');
    deleteButton.textContent = ' Delete Order';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = () => deleteOrder(order._id, listItem);

    // Append the delete button to the list item
    listItem.appendChild(deleteButton);
    // Append the list item to the correct table's order list
    orderList.appendChild(listItem);
}

// Function to delete an order (DELETE request)
async function deleteOrder(orderId, listItem) {
    try {
        await fetch(`${apiUrl}/${orderId}`, {
            method: 'DELETE'
        });
        // Remove from the DOM
        listItem.remove();
        // Remove from local storage
        removeFromLocalStorage(orderId);
    } catch (error) {
        console.error('Error deleting order:', error);
    }
}

// Function to save order to local storage
function saveToLocalStorage(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    // Prevent duplicate entries in local storage
    if (!orders.find(o => o._id === order._id)) {
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Function to remove order from local storage
function removeFromLocalStorage(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order._id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to clear all order lists
function clearOrderLists() {
    document.getElementById('table1Orders').innerHTML = '';
    document.getElementById('table2Orders').innerHTML = '';
    document.getElementById('table3Orders').innerHTML = '';
}
