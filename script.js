/**
 * ToDo List Application
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const taskCounter = document.getElementById('task-counter');
  const appFooter = document.getElementById('app-footer');
  const remainingCount = document.getElementById('remaining-count');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const inputWrapper = document.querySelector('.input-wrapper');

  // State: load tasks from localStorage or initialize with empty array
  let tasks = JSON.parse(localStorage.getItem('todos_app_data')) || [];

  /**
   * Save tasks to localStorage and update view
   */
  function saveAndRender() {
    localStorage.setItem('todos_app_data', JSON.stringify(tasks));
    render();
  }

  /**
   * Render the task list and update empty state visibility
   */
  function render() {
    // 1. Check if the list is empty
    if (tasks.length === 0) {
      emptyState.classList.remove('hidden');
      todoList.innerHTML = '';
      appFooter.classList.add('hidden');
      taskCounter.textContent = 'Всего задач: 0';
      return;
    }

    // Hide empty state if tasks exist
    emptyState.classList.add('hidden');
    appFooter.classList.remove('hidden');

    // 2. Clear current list DOM
    todoList.innerHTML = '';

    // 3. Render each task
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      // Checkbox button
      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'checkbox-btn';
      checkBtn.setAttribute('aria-label', task.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную');
      checkBtn.innerHTML = `
        <span class="custom-checkbox">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      `;
      checkBtn.addEventListener('click', () => toggleTask(task.id));

      // Task text
      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = task.text;
      span.title = 'Нажмите, чтобы изменить статус';
      span.addEventListener('click', () => toggleTask(task.id));

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', 'Удалить задачу');
      deleteBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      `;
      deleteBtn.addEventListener('click', () => deleteTaskWithAnimation(task.id, li));

      li.appendChild(checkBtn);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });

    // 4. Update stats
    const activeTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.length - activeTasks;

    taskCounter.textContent = `Всего задач: ${tasks.length} (завершено: ${completedTasks})`;
    remainingCount.textContent = `Осталось: ${activeTasks}`;

    if (completedTasks > 0) {
      clearCompletedBtn.style.visibility = 'visible';
    } else {
      clearCompletedBtn.style.visibility = 'hidden';
    }
  }

  /**
   * Add a new task
   */
  function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
      // Shake animation if input is empty
      inputWrapper.classList.remove('shake');
      void inputWrapper.offsetWidth; // Trigger reflow
      inputWrapper.classList.add('shake');
      todoInput.focus();
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false
    };

    tasks.unshift(newTask);
    saveAndRender();
    todoInput.value = '';
    todoInput.focus();
  }

  /**
   * Toggle task completion status
   */
  function toggleTask(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveAndRender();
  }

  /**
   * Delete task with smooth exit animation
   */
  function deleteTaskWithAnimation(id, element) {
    element.classList.add('removing');
    element.addEventListener('animationend', () => {
      tasks = tasks.filter(task => task.id !== id);
      saveAndRender();
    }, { once: true });
  }

  /**
   * Clear all completed tasks
   */
  function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
  }

  // Event Listeners
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(todoInput.value);
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  // Initial render on page load
  render();
});
