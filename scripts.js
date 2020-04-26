const createEl = (tag, text, attrs = {}) => {
  const el = document.createElement(tag)
  el.textContent = text
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key])
  })
  return el
}

const fetchGetTaskList = () => {
  return fetch(`${endpoint}/list`)
    .then(response => response.json())
}

const fetchEditTask = (id, body) => {
  return fetch(`${endpoint}/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const fetchDeleteTask = (id) => {
  return fetch(`${endpoint}/delete/${id}`, {
    method: 'DELETE',
  })
}

const fetchAddTask = (body) => {
  return fetch(`${endpoint}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const endpoint = 'http://localhost:3000'

const renderTask = (task, list) => {
  const li = createEl('li')
  const text = createEl('div', task.text, { class: task.done ? 'text done' : 'text' })
  const btnWrapper = createEl('div', null, { class: 'btn-wrapper' })

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
    editBtn.disabled = true
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

  li.appendChild(text)
  li.appendChild(btnWrapper)
  btnWrapper.appendChild(doneBtn)
  btnWrapper.appendChild(editBtn)
  btnWrapper.appendChild(deleteBtn)
  list.appendChild(li)
}

const renderTaskList = () => {
  const list = createEl('ul', null, { id: 'list' })
  document.body.appendChild(list)

  fetchGetTaskList()
    .then(taskList => taskList.forEach((item) => renderTask(item, list)))
}

renderTaskList()

const input = document.querySelector('input[name="todo-text"]')
const textarea = document.querySelector('textarea[name="todo-description"]')
const createBtn = document.querySelector('#create')

createBtn.addEventListener('click', () => {
  fetchAddTask({ text: input.value, textarea: input.value })
    .then(() => window.location.reload())
})




