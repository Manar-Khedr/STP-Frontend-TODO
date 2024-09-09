function addItem(type) {
      let inputId = type === 'complete' ? 'complete-input-task' : 'pending-input-task';
      const todoText = document.getElementById(inputId).value;
      if (todoText.trim() !== "") {
        const newTask = `
          <div class="form-check d-flex align-items-center">
  <input class="form-check-input" type="checkbox" value="" id="flexCheck${type}${Date.now()}" ${type === 'complete' ? 'checked' : ''} onchange="moveItem(this)">
  <label class="form-check-label ms-2" for="flexCheck${type}${Date.now()}">
    ${todoText}
  </label>
  <i class="bi bi-trash ms-auto cursor-pointer" onclick="deleteItem(this)"></i>
</div>

        `;

        const newRow = document.createElement('tr');
        const newCell = document.createElement('td');
        newCell.className = type === 'complete' ? "col-complete table-success" : "col-pending table-warning";
        newCell.innerHTML = newTask;

        newRow.appendChild(newCell);

        document.getElementById(type === 'complete' ? 'completed-todos' : 'pending-todos').appendChild(newRow);

        document.getElementById(inputId).value = "";  
        filterTasks(type);  
      }
    }

    function moveItem(checkbox) {
      const row = checkbox.closest('tr');
      const column = checkbox.closest('td');
      const todoText = column.querySelector('label').innerText;
      const targetType = checkbox.checked ? 'complete' : 'pending';

      column.remove(); 

      if (!row.querySelector('.col-complete') && !row.querySelector('.col-pending')) {
        row.remove();
      }

    
      addItemToColumn(targetType, todoText);
    }

    function addItemToColumn(type, todoText) {
      const newTask = `
        <div class="form-check d-flex align-items-center">
  <input class="form-check-input" type="checkbox" value="" id="flexCheck${type}${Date.now()}" ${type === 'complete' ? 'checked' : ''} onchange="moveItem(this)">
  <label class="form-check-label ms-2" for="flexCheck${type}${Date.now()}">
    ${todoText}
  </label>
  <i class="bi bi-trash ms-auto cursor-pointer" onclick="deleteItem(this)"></i>
</div>

      `;

      const newRow = document.createElement('tr');
      const newCell = document.createElement('td');
      newCell.className = type === 'complete' ? "col-complete table-success" : "col-pending table-warning";
      newCell.innerHTML = newTask;

      newRow.appendChild(newCell);

      document.getElementById(type === 'complete' ? 'completed-todos' : 'pending-todos').appendChild(newRow);

      filterTasks(type); 
    }

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

    function deleteItem(icon) {
        const row = icon.closest('tr');
        row.remove();
    }
    
