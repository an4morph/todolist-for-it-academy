const list = document.querySelector('#list')

const endpoint = 'http://localhost:3000'

const fetchGetTaskList = () => {
  return fetch(`${endpoint}/list`)
    .then(response => {
      if (response.ok) return response.json()
      throw new Error('Не удалось загрузить список задач')
    })
}

const fetchEditTask = (id, body) => {
  return fetch(`${endpoint}/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Не удалось отредактировать задачу')
  })
}

const fetchDeleteTask = (id) => {
  return fetch(`${endpoint}/delete/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Не удалось удалить задачу')
  })
}

const fetchAddTask = (body) => {
  return fetch(`${endpoint}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Не удалось добавить задачу')
  })
}

const createEl = (tag, text, attrs = {}) => {
  const el = document.createElement(tag)
  el.textContent = text
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key])
  })
  return el
}

const renderTask = (task) => {
  const li = createEl('li')
  const text = createEl('div', task.text)

  const doneBtnText = !task.done ? 'Сделано' : 'Не сделано'
  const doneBtn = createEl('button', doneBtnText)

  const editBtn = createEl('button', ' Редактировать')

  const deleteBtn = createEl('button', 'Удалить')
  
  deleteBtn.addEventListener('click', () => {
    fetchDeleteTask(task.id)
    .then(() => window.location.reload())
  })

  editBtn.addEventListener('click', () => {
    const input = createEl('input', { class: 'edit-input' })
    input.type = 'text'
    input.value = task.text
    li.insertBefore(input, text)
    li.removeChild(text)
    input.addEventListener('blur', () => {
      fetchEditTask(task.id, { text: input.value })
        .then(() => window.location.reload())
    })
  })

  doneBtn.addEventListener('click', () => {
    fetchEditTask(task.id, { done: !task.done })
    .then(() => window.location.reload())
  })

  if (task.done) li.classList.add('done')

  li.appendChild(text)
  li.appendChild(doneBtn)
  li.appendChild(editBtn)
  li.appendChild(deleteBtn)
  list.appendChild(li)
}

fetchGetTaskList()
  .then(taskList => taskList.forEach(renderTask))
  .catch((err) => {
    const errDiv = createEl('div', err.message, { class: 'list-error' })
    list.appendChild(errDiv)
  })

const input = document.querySelector('input[name="todo-text"]')
const textarea = document.querySelector('textarea[name="todo-description"]')
const createBtn = document.querySelector('#create')

createBtn.addEventListener('click', () => {
  fetchAddTask({ text: input.value, textarea: input.value })
    .then(() => window.location.reload())
})




