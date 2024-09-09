import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKiCqsIclYwp76Hb8CumjzPxaKiHx4tHI",
  authDomain: "stp-todo.firebaseapp.com",
  projectId: "stp-todo",
  storageBucket: "stp-todo.appspot.com",
  messagingSenderId: "678165712828",
  appId: "1:678165712828:web:f169712ec610dd2ac725b9",
  measurementId: "G-35LQTMVDC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a new todo item to Firestore
async function addItemToFirestore(type, todoText) {
    try {
        const docRef = await addDoc(collection(db, "todos"), {
            text: todoText,
            type: type,
            createdAt: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

// Function to fetch all todos from Firestore
async function fetchTodos() {
    try {
        const querySnapshot = await getDocs(collection(db, "todos"));
        const todos = [];
        querySnapshot.forEach((doc) => {
            todos.push({ id: doc.id, ...doc.data() });
        });
        return todos;
    } catch (e) {
        console.error("Error fetching todos: ", e);
        throw e;
    }
}

// Function to delete a todo from Firestore
async function deleteTodoFromFirestore(id) {
    try {
        await deleteDoc(doc(db, "todos", id));
        console.log("Document successfully deleted!");
    } catch (e) {
        console.error("Error removing document: ", e);
        throw e;
    }
}

// Function to update a todo's type in Firestore
async function updateTodoTypeInFirestore(id, newType) {
    try {
        await updateDoc(doc(db, "todos", id), {
            type: newType
        });
        console.log("Document successfully updated!");
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
}

// Function to add item (now submits a POST request to Firestore)
async function addItem(type) {
    let inputId = type === 'complete' ? 'complete-input-task' : 'pending-input-task';
    const todoText = document.getElementById(inputId).value;
    if (todoText.trim() !== "") {
        try {
            const docId = await addItemToFirestore(type, todoText);
            addItemToColumn(type, todoText, docId);
            document.getElementById(inputId).value = "";
            console.log(`Todo item "${todoText}" added to Firebase with ID: ${docId}`);
        } catch (error) {
            console.error("Failed to add item:", error);
            alert("Failed to add item. Please try again.");
        }
    }
}

// Function to move item (now updates Firestore)
async function moveItem(checkbox) {
    const row = checkbox.closest('tr');
    const todoText = row.querySelector('label').innerText;
    const targetType = checkbox.checked ? 'complete' : 'pending';
    const todoId = row.dataset.id;

    try {
        await updateTodoTypeInFirestore(todoId, targetType);
        row.remove();
        addItemToColumn(targetType, todoText, todoId);
        console.log(`Todo item "${todoText}" moved to ${targetType} in Firebase`);
    } catch (error) {
        console.error("Failed to move item:", error);
        alert("Failed to move item. Please try again.");
        // Revert the checkbox state
        checkbox.checked = !checkbox.checked;
    }
}

// Function to add item to column (now includes todo ID)
function addItemToColumn(type, todoText, todoId) {
    const newRow = document.createElement('tr');
    newRow.dataset.id = todoId;
    newRow.className = type === 'complete' ? 'table-success' : 'table-warning';
    
    const newCell = document.createElement('td');
    newCell.className = type === 'complete' ? 'col-complete' : 'col-pending';
    
    newCell.innerHTML = `
        <div class="form-check d-flex align-items-center">
            <input class="form-check-input" type="checkbox" value="" id="flexCheck${type}${Date.now()}" ${type === 'complete' ? 'checked' : ''} onchange="moveItem(this)">
            <label class="form-check-label ms-2" for="flexCheck${type}${Date.now()}">
                ${todoText}
            </label>
            <i class="bi bi-trash ms-auto cursor-pointer" onclick="deleteItem(this)"></i>
        </div>
    `;

    newRow.appendChild(newCell);
    document.getElementById(type === 'complete' ? 'completed-todos' : 'pending-todos').appendChild(newRow);
}

// Function to delete item (now deletes from Firestore)
async function deleteItem(icon) {
    const row = icon.closest('tr');
    const todoId = row.dataset.id;
    const todoText = row.querySelector('label').innerText;
    try {
        await deleteTodoFromFirestore(todoId);
        row.remove();
        console.log(`Todo item "${todoText}" deleted from Firebase`);
    } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Failed to delete item. Please try again.");
    }
}

// Function to load todos on page load
async function loadTodos() {
    try {
        const todos = await fetchTodos();
        todos.forEach(todo => {
            addItemToColumn(todo.type, todo.text, todo.id);
        });
        console.log(`Loaded ${todos.length} todos from Firebase`);
    } catch (error) {
        console.error("Failed to load todos:", error);
        alert("Failed to load todos. Please refresh the page.");
    }
}

// The filterTasks function remains unchanged as it's a frontend search
function filterTasks(type) {
    const inputId = type === 'complete' ? 'complete-search' : 'pending-search';
    const filter = document.getElementById(inputId).value.toUpperCase();
    const tableId = type === 'complete' ? 'completed-todos' : 'pending-todos';
    const rows = document.getElementById(tableId).getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].querySelector('td');
        if (cell) {
            const text = cell.textContent || cell.innerText;
            rows[i].style.display = text.toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    document.getElementById('complete-add-btn').addEventListener('click', () => addItem('complete'));
    document.getElementById('pending-add-btn').addEventListener('click', () => addItem('pending'));
    document.getElementById('complete-search').addEventListener('input', () => filterTasks('complete'));
    document.getElementById('pending-search').addEventListener('input', () => filterTasks('pending'));
});

// Make functions available globally
window.moveItem = moveItem;
window.deleteItem = deleteItem;