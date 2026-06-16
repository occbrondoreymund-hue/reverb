import './bootstrap';

let currentUserId = null;
let currentMessages = [];

// Initialize Echo
if (window.Echo) {
    // User selection
    document.querySelectorAll('.user-item').forEach(item => {
        item.addEventListener('click', function() {
            const userId = this.dataset.userId;
            const userName = this.querySelector('.font-medium').textContent;
            
            // Update UI
            document.querySelectorAll('.user-item').forEach(el => el.classList.remove('bg-blue-100'));
            this.classList.add('bg-blue-100');
            
            document.getElementById('chat-header').innerHTML = `
                <h3 class="font-bold text-lg">Chatting with ${userName}</h3>
            `;
            
            document.getElementById('receiver_id').value = userId;
            document.getElementById('message-input').disabled = false;
            document.getElementById('send-btn').disabled = false;
            
            currentUserId = userId;
            loadMessages(userId);
            
            // Subscribe to private channel
            window.Echo.leave('chat.' + userId);
            window.Echo.private('chat.' + userId)
                .listen('MessageSent', (e) => {
                    if (e.message.sender_id !== currentUserId) {
                        appendMessage(e.message, false);
                    }
                });
        });
    });

    // Load messages
    function loadMessages(userId) {
        fetch(`/load-messages/${userId}`)
            .then(response => response.json())
            .then(messages => {
                currentMessages = messages;
                const container = document.getElementById('messages-container');
                container.innerHTML = '';
                messages.forEach(msg => {
                    appendMessage(msg, msg.sender_id === userId);
                });
                scrollToBottom();
            });
    }

    // Append message
    function appendMessage(message, isReceived) {
        const container = document.getElementById('messages-container');
        const div = document.createElement('div');
        const align = isReceived ? 'justify-start' : 'justify-end';
        const bgColor = isReceived ? 'bg-white' : 'bg-blue-500';
        const textColor = isReceived ? 'text-gray-800' : 'text-white';
        
        div.className = `flex ${align}`;
        div.innerHTML = `
            <div class="max-w-xs ${bgColor} ${textColor} rounded-lg px-4 py-2 shadow">
                <p class="font-bold text-sm">${isReceived ? message.sender.name : 'You'}</p>
                <p>${message.message}</p>
                <p class="text-xs opacity-75 mt-1">${new Date(message.created_at).toLocaleTimeString()}</p>
            </div>
        `;
        container.appendChild(div);
        scrollToBottom();
    }

    // Scroll to bottom
    function scrollToBottom() {
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    // Send message
    document.getElementById('message-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const receiverId = document.getElementById('receiver_id').value;
        const message = input.value.trim();
        
        if (!message || !receiverId) return;
        
        try {
            const response = await fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                },
                body: JSON.stringify({
                    receiver_id: receiverId,
                    message: message,
                }),
            });
            
            const data = await response.json();
            if (data.success) {
                appendMessage(data.message, false);
                input.value = '';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}