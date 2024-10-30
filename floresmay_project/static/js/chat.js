// Las variables nicolasImage, mayImage y stickersPath ya están definidas en el HTML

// Definir la conversación como un objeto con nodos
const conversation = {
    start: {
        messages: [
            { sender: 'Nicolas', type: 'message', content: 'Hola May' }
        ],
        options: [
            { text: '¡Holissss!', next: 'happyResponse' },
            { text: 'Mensaje sarcástico', next: 'sarcasticResponse' },
            { text: 'Mensaje enojada', next: 'angryResponse' }
        ]
    },
    happyResponse: {
        messages: [
            { sender: 'May', type: 'message', content: '¡Hola! 😊 ¡Qué alegría hablar contigo!' },
            { sender: 'May', type: 'sticker', content: 'cartel.png' },
            { sender: 'Nicolas', type: 'message', content: 'Me alegra escuchar eso. ¿Cómo va tu día?' }
        ],
        options: [
            { text: 'Excelente', next: 'excellentDay' },
            { text: 'Podría ser mejor', next: 'couldBeBetter' }
        ]
    },
    sarcasticResponse: {
        messages: [
            { sender: 'May', type: 'message', content: 'Oh, genial... 🙄' },
            { sender: 'Nicolas', type: 'message', content: 'Parece que alguien se levantó con el pie izquierdo.' },
            { sender: 'Nicolas', type: 'message', content: '¿Quieres hablar al respecto?' }
        ],
        options: [
            { text: 'Sí, un poco', next: 'badMood' },
            { text: 'No, solo bromeo', next: 'justKidding' }
        ]
    },
    angryResponse: {
        messages: [
            { sender: 'May', type: 'message', content: '¿Qué quieres ahora? 😒' },
            { sender: 'Nicolas', type: 'message', content: 'Solo quería saludarte. ¿Todo bien?' }
        ],
        options: [
            { text: 'No, déjame en paz', next: 'leaveMeAlone' },
            { text: 'Perdón, tuve un mal día', next: 'apologize' }
        ]
    },
    // Continua definiendo los nodos según tus necesidades
    // Ejemplo de continuación para 'excellentDay'
    excellentDay: {
        messages: [
            { sender: 'May', type: 'message', content: '¡Excelente! Todo va de maravilla.' },
            { sender: 'Nicolas', type: 'message', content: '¡Eso es genial! Me alegro mucho por ti.' }
        ],
        options: [
            { text: 'Gracias', next: 'end' },
            { text: '¿Y tú qué tal?', next: 'howAboutYou' }
        ]
    },
    // Nodo final
    end: {
        messages: [
            { sender: 'Nicolas', type: 'message', content: 'Ha sido un placer hablar contigo. ¡Hasta luego!' }
        ],
        options: []
    },
    // Puedes continuar agregando más nodos y opciones
};

// Variable para llevar el seguimiento del nodo actual
let currentNode = conversation.start;

// Función para mostrar los mensajes del nodo actual con retraso y indicador de "Escribiendo..."
function displayMessages(node) {
    const chatWindow = document.getElementById('chat-window');

    let index = 0;

    function showNextMessage() {
        if (index < node.messages.length) {
            const message = node.messages[index];

            // Mostrar indicador de "Escribiendo..." antes de mostrar el mensaje
            showTypingIndicator(message.sender);

            // Después de un retraso, mostrar el mensaje y ocultar el indicador
            setTimeout(() => {
                hideTypingIndicator();
                addMessageToChat(message);
                index++;
                showNextMessage();
            }, 2000); // Retraso de 3 segundos
        } else {
            // Mostrar las opciones si las hay
            if (node.options && node.options.length > 0) {
                showOptions(node.options);
            } else {
                // Si no hay más opciones, el chat termina
                const endMessageDiv = document.createElement('div');
                endMessageDiv.classList.add('message', 'received');
                endMessageDiv.innerHTML = `<img src="${nicolasImage}" alt="Nicolas" class="profile-pic"><span>Fin de la conversación.</span>`;
                chatWindow.appendChild(endMessageDiv);
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        }
    }

    showNextMessage();
}

// Función para añadir un mensaje al chat
function addMessageToChat(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Determinar si el mensaje es enviado o recibido
    if (message.sender === 'May') {
        messageDiv.classList.add('sent');
        messageDiv.innerHTML = `<img src="${mayImage}" alt="May" class="profile-pic">`;
    } else {
        messageDiv.classList.add('received');
        messageDiv.innerHTML = `<img src="${nicolasImage}" alt="Nicolas" class="profile-pic">`;
    }

    if (message.type === 'message') {
        // Mensaje de texto regular
        const messageContent = document.createElement('span');
        messageContent.innerText = message.content;
        messageDiv.appendChild(messageContent);
    } else if (message.type === 'sticker') {
        // Mensaje tipo sticker
        const stickerImage = document.createElement('img');
        stickerImage.src = stickersPath + message.content;
        stickerImage.classList.add('sticker');
        messageDiv.appendChild(stickerImage);
    }

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Función para mostrar el indicador de "Escribiendo..."
function showTypingIndicator(sender) {
    const chatWindow = document.getElementById('chat-window');

    if (!document.getElementById('typing-indicator')) {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message');

        if (sender === 'May') {
            typingDiv.classList.add('sent');
            typingDiv.innerHTML = `<img src="${mayImage}" alt="May" class="profile-pic">`;
        } else {
            typingDiv.classList.add('received');
            typingDiv.innerHTML = `<img src="${nicolasImage}" alt="Nicolas" class="profile-pic">`;
        }

        typingDiv.setAttribute('id', 'typing-indicator');

        const typingContent = document.createElement('span');
        typingContent.classList.add('typing-indicator');
        typingContent.textContent = 'Escribiendo'; // Asegúrate de que este texto se establece
        typingDiv.appendChild(typingContent);

        chatWindow.appendChild(typingDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Iniciar la animación de los puntos
        startTypingDots(typingContent);
    }
}

// Función para ocultar el indicador de "Escribiendo..."
function hideTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.parentNode.removeChild(typingDiv);
        stopTypingDots();
    }
}

// Variables para controlar la animación de los puntos
let typingInterval;

function startTypingDots(typingContent) {
    let dotCount = 0;

    typingInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1; // Ciclo de 1 a 3 puntos
        typingContent.textContent = 'Escribiendo' + '.'.repeat(dotCount);
    }, 500);
}

function stopTypingDots() {
    clearInterval(typingInterval);
}

// Función para mostrar las opciones como botones
function showOptions(options) {
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpiar opciones anteriores

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => {
            // Mostrar indicador de "Escribiendo..." para May
            showTypingIndicator('May');

            // Después de un retraso, añadir el mensaje de May al chat
            setTimeout(() => {
                hideTypingIndicator();
                const message = { sender: 'May', type: 'message', content: option.text };
                addMessageToChat(message);

                // Avanzar al siguiente nodo
                currentNode = conversation[option.next];
                optionsDiv.innerHTML = ''; // Limpiar opciones
                setTimeout(() => {
                    displayMessages(currentNode);
                }, 500); // Pequeño retraso
            }, 2000); // Retraso de 3 segundos para May
        };
        optionsDiv.appendChild(button);
    });
}

// Iniciar la conversación
displayMessages(currentNode);
