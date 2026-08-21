// Connect to the Socket.io server (same host/port as this page)
const socket = io()

// Grab elements from the HTML
const loginScreen = document.getElementById('login-screen')
const chatScreen = document.getElementById('chat-screen')
const usernameInput = document.getElementById('username-input')
const joinBtn = document.getElementById('join-btn')
const onlineAs = document.getElementById('online-as')
const messagesDiv = document.getElementById('messages')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

let myUsername = ''

// ---- Join the chat ----

joinBtn.addEventListener('click', joinChat)
usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') joinChat()
})

function joinChat() {
    const name = usernameInput.value.trim()
    if (!name) return

    myUsername = name

    // Tell the server our username
    socket.emit('join', myUsername)

    // Switch from login screen to chat screen
    loginScreen.classList.add('hidden')
    chatScreen.classList.remove('hidden')
    onlineAs.textContent = `You: ${myUsername}`
    messageInput.focus()
}

// ---- Send a message ----

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const text = messageInput.value.trim()
    if (!text) return

    // Send message text to the server
    socket.emit('send_message', text)

    messageInput.value = ''
})

// ---- Receive events from the server ----

// When you first connect, server sends all past messages
socket.on('chat_history', (messages) => {
    messages.forEach((msg) => {
        addMessage(msg.username, msg.message, msg.createdAt)
    })
    scrollToBottom()
})

// When someone sends a new message
socket.on('new_message', (msg) => {
    addMessage(msg.username, msg.message, msg.createdAt)
    scrollToBottom()
})

// When someone joins or leaves
socket.on('user_joined', (text) => addSystemMessage(text))
socket.on('user_left', (text) => addSystemMessage(text))

// ---- Helper functions to show messages on screen ----

function addMessage(username, text, createdAt) {
    const div = document.createElement('div')

    // Your messages go on the right, others on the left
    const isOwn = username === myUsername
    div.className = `message ${isOwn ? 'own' : 'other'}`

    const time = new Date(createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })

    div.innerHTML = `
        <div class="username">${escapeHtml(username)}</div>
        <div>${escapeHtml(text)}</div>
        <div class="time">${time}</div>
    `

    messagesDiv.appendChild(div)
}

function addSystemMessage(text) {
    const div = document.createElement('div')
    div.className = 'message system'
    div.textContent = text
    messagesDiv.appendChild(div)
    scrollToBottom()
}

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// Prevent XSS — convert special characters to safe HTML entities
function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}
