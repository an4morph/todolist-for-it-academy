const endpoint = 'http://localhost:3000'

export default {
  getTaskList: () => {
    return fetch(`${endpoint}/list`)
    .then(response => {
      if (!response.ok) throw new Error('Ошибка удаления')
      return response.json()
    })
  },

  editTask: (id, body) => {
    return fetch(`${endpoint}/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    .then(response => {
      if (!response.ok) throw new Error('Ошибка редактирования')
    })
  },

  addTask: (body) => {
    return fetch(`${endpoint}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    .then(response => {
      if (!response.ok) throw new Error('Ошибка cоздания')
    })
  },
  
  deleteTask: (id) => {
    return fetch(`${endpoint}/delete/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) throw new Error('Ошибка удаления')
    })
  }
}