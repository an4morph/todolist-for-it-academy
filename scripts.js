// метод облегчающий создание html элемента
const createEl = (tag, text, attrs = {}) => {
  const el = document.createElement(tag)
  el.textContent = text
  // цикл по атрибутам из агрументов функции и их назначение
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key])
  })
  return el
}

// GET '/list' - запрос на получение всего списка задач
const fetchGetTaskList = () => {
  return fetch(`${endpoint}/list`)
    .then(response => response.json())
}

// POST '/add' - запрос на создание задачи по ID
const fetchAddTask = (body) => {
  return fetch(`${endpoint}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// PUT '/edit/:id' - запрос на редактирование задачи по ID
const fetchEditTask = (id, body) => {
  return fetch(`${endpoint}/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// DELETE '/delete/:id' - запрос на удаление задачи по ID
const fetchDeleteTask = (id) => {
  return fetch(`${endpoint}/delete/${id}`, {
    method: 'DELETE',
  })
}

const endpoint = 'http://localhost:3000'

// функция, которая отрисовывает html задачу. 
// Аргументы task - объект задачи с бэка, list - родительский DOM элемент, в котором отрисуются задачи
const renderTask = (task, list) => {
  // создание основных html элементов в задаче
  const li = createEl('li')
  const text = createEl('div', task.text, { class: task.done ? 'text done' : 'text' })
  const btnWrapper = createEl('div', null, { class: 'btn-wrapper' })

  // переменная отображающая что можно сделать с задачей
  // если задача не сделана, то надпись на кнопке 'Сделано' пометит ее как сделанную и наоборот
  const doneBtnText = !task.done ? 'Сделано' : 'Не сделано'

  // создание html елементов кнопок задачи
  const doneBtn = createEl('button', doneBtnText)
  const editBtn = createEl('button', ' Редактировать')
  const deleteBtn = createEl('button', 'Удалить')
  
  // логика клика по кнопке "Удалить"
  deleteBtn.addEventListener('click', () => {
    // запрос на бэкенд DELETE /delete/:id
    fetchDeleteTask(task.id)
    // при успешном ответе страница перезагружается
    .then(() => window.location.reload())
  })
  // логика клика по кнопке "Редактировать"
  editBtn.addEventListener('click', () => {
    const input = createEl('input', { class: 'edit-input' })
    input.type = 'text'
    input.value = task.text
    editBtn.disabled = true
    li.insertBefore(input, text)
    li.removeChild(text)
    input.addEventListener('blur', () => {
      // запрос на бэкенд PUT /edit/:id
      fetchEditTask(task.id, { text: input.value })
      // при успешном ответе страница перезагружается
        .then(() => window.location.reload())
    })
  })
  // логика клика по кнопке "Сделано"
  doneBtn.addEventListener('click', () => {
    // запрос на бэкенд PUT /edit/:id
    fetchEditTask(task.id, { done: !task.done })
    // при успешном ответе страница перезагружается
    .then(() => window.location.reload())
  })

  // прикрепление html элементов к DOM дереву
  li.appendChild(text)
  li.appendChild(btnWrapper)
  btnWrapper.appendChild(doneBtn)
  btnWrapper.appendChild(editBtn)
  btnWrapper.appendChild(deleteBtn)
  list.appendChild(li)
}

// функция, которая отрисовывает весь список задач на экран
const renderTaskList = () => {
  const list = createEl('ul', null, { id: 'list' })
  document.body.appendChild(list)

  // запрос на бэкенд GET /list
  fetchGetTaskList()
    // в результате успешного ответа: поочередно отрисовывается каждая задача в списке
    .then(taskList => taskList.forEach((item) => renderTask(item, list)))
}

// вызываем функцию отрисовки списка задач при загрузке страницы
renderTaskList()


// создание новой задачи //
// // // // // // // // /// 
const input = document.querySelector('input[name="todo-text"]')
const textarea = document.querySelector('textarea[name="todo-description"]')
const createBtn = document.querySelector('#create')

createBtn.addEventListener('click', () => {
  // запрос на бэкенд POST /add
  fetchAddTask({ text: input.value, textarea: input.value })
    // при успешном ответе страница перезагружается
    .then(() => window.location.reload())
})




