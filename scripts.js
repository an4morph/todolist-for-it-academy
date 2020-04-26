console.log('страница загрузилась')

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
    .then(response => {
      if (!response.ok) throw new Error('Ошибка удаления')
      return response.json()
    })
}

const fetchEditTask = (id, body) => {
  return fetch(`${endpoint}/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка редактирования')
  })
}

const fetchDeleteTask = (id) => {
  return fetch(`${endpoint}/delete/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка удаления')
  })
}

const fetchAddTask = (body) => {
  return fetch(`${endpoint}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка cоздания')
  })
}

const endpoint = 'http://localhost:3000'

const renderTask = (task, list) => {
  const li = createEl('li', null)
  const text = createEl('div', task.text, { class: task.done ? 'text done' : 'text' })
  const btnWrapper = createEl('div', null, { class: 'btn-wrapper' })

  const doneBtnText = !task.done ? 'Сделано' : 'Не сделано'
  const doneBtn = createEl('button', doneBtnText)
  const editBtn = createEl('button', ' Редактировать')
  const deleteBtn = createEl('button', 'Удалить')
  const errDiv = createEl('div', null, { class: 'error' })
  
  deleteBtn.addEventListener('click', () => {
    fetchDeleteTask(task.id)
      .then(() => {
        document.body.removeChild(list)
        renderTaskList()
      })
      .catch((err) => {
        errDiv.textContent = err.message
      })
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
        .then(() => {
          document.body.removeChild(list)
          renderTaskList()
        })
        .catch((err) => {
          errDiv.textContent = err.message
        })
    })
  })

  doneBtn.addEventListener('click', () => {
    fetchEditTask(task.id, { done: !task.done })
      .then(() => {
        document.body.removeChild(list)
        renderTaskList()
      })
      .catch((err) => {
        errDiv.textContent = err.message
      })
  })

  li.appendChild(text)
  li.appendChild(btnWrapper)
  li.appendChild(errDiv)
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
    .catch((err) => {
      const errDiv = createEl('div', err.message, { class: 'error' })
      list.appendChild(errDiv)
    })
}

renderTaskList()

const input = document.querySelector('input[name="todo-text"]')
const textarea = document.querySelector('textarea[name="todo-description"]')
const createBtn = document.querySelector('#create')
const createErr = document.querySelector('#create-error')

createBtn.addEventListener('click', () => {
  fetchAddTask({ text: input.value, textarea: input.value })
  .then(taskList => taskList.forEach((item) => renderTask(item, list)))
    .catch((err) => {
      createErr.textContent = err.message
    })
})




