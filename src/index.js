import api from './api'

const createEl = (tag, text, attrs = {}) => {
  const el = document.createElement(tag)
  el.textContent = text
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key])
  })
  return el
}

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
    api.deleteTask(task.id)
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
      api.editTask(task.id, { text: input.value })
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
    api.editTask(task.id, { done: !task.done })
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
  console.log(list)
  document.body.appendChild(list)
  api.getTaskList()
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
  api.addTask({ text: input.value, textarea: textarea.value })
  .then(() => {
    const list = document.getElementById('list')
    document.body.removeChild(list)
    renderTaskList()
  })
  .catch((err) => {
    createErr.textContent = err.message
  })
})