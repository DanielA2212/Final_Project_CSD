// Initialize the IndexedDB wrapper
const db = new IndexedDBWrapper('CostManagerDB', 1);

// Define object store configuration
const stores = [
    {
        name: 'costItems',
        options: { keyPath: 'id', autoIncrement: true },
        indexes: [
            { name: 'category', keyPath: 'category' },
            { name: 'date', keyPath: 'date' }
        ]
    }
];

// Open the database
db.open(stores)
    .then(() => console.log('Database opened successfully'))
    .catch(err => console.error('Database error:', err));

// Add Cost Item
document.getElementById('addCostButton').addEventListener('click', async () => {
    const sum = parseFloat(document.getElementById('sum').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (isNaN(sum) || !category || !description || !date) {
        alert('Please fill in all fields.');
        return;
    }

    const newItem = { sum, category, description, date };

    try {
        const id = await db.add('costItems', newItem);
        alert(`Cost item added with ID: ${id}`);
        document.getElementById('sum').value = '';
        document.getElementById('description').value = '';
        document.getElementById('date').value = '';
    } catch (err) {
        console.error('Error adding cost item:', err);
    }
});

// Get All Cost Items
document.getElementById('getAllCostsButton').addEventListener('click', async () => {
    try {
        const costItems = await db.getAll('costItems');
        const costList = document.getElementById('costList');
        costList.innerHTML = '';

        if (costItems.length === 0) {
            costList.innerHTML = '<li>No cost items found.</li>';
            return;
        }

        costItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.date} - ${item.category}: $${item.sum} (${item.description})`;
            costList.appendChild(listItem);
        });
    } catch (err) {
        console.error('Error retrieving cost items:', err);
    }
});
