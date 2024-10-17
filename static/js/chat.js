// Variable para llevar la cuenta del evento actual
let currentEvent = 'evento1';
let currentOptions = []; // Nueva variable para las opciones actuales

const conversation = {
    'evento1': {
        message: 'Hola May',
        responses: [
            {
                text: 'Holis✨',
                nextMessages: ['Dame una oportunidad, no seas así...', 'De verdad, soy un buen tipo.', 'Solo necesito una oportunidad.'],
                nextEvent: 'evento2'
            },
            {
                text: 'Hola futuro esposo que guapo que sos',
                nextMessages: ['¡Wow, gracias!', '¿Nos casamos ya o después?'],
                nextEvent: 'evento2'
            },
            {
                text: 'Solo hablo con fans de Friends',
                nextMessages: ['¡Por supuesto! Ross y Rachel son lo mejor, ¿verdad?', 'Dime que no odias a Chandler.'],
                nextEvent: 'evento2'
            }
        ]
    },
    'evento2': {
        message: '¡Hey! ¿Sabías que hoy es un día especial?',
        responses: [
            {
                text: '¿Por qué es especial?',
                nextMessages: ['Porque estoy aquí hablando contigo :)'],
                nextOptions: [
                    { text: '¡Qué lindo!', nextMessage: 'Gracias, me haces feliz.' }, // Chat finaliza aquí
                    { text: 'Eso suena raro...', nextMessage: 'Bueno, soy raro, pero simpático.' } // Chat finaliza aquí
                ]
            },
            {
                text: '¡Claro que sí!',
                nextMessages: ['Me alegra que lo veas así. ¿Tienes planes?'],
                nextOptions: [
                    { text: 'Sí, muchos', nextMessage: '¡Genial! Espero que disfrutes.' }, // Chat finaliza aquí
                    { text: 'No, ninguno', nextMessage: 'Podemos hacer algo juntos, ¿qué te parece?' } // Chat finaliza aquí
                ]
            },
            {
                text: 'No, cuéntame más',
                nextMessages: ['Es especial porque quiero que lo sea para ti.'],
                nextOptions: [
                    { text: 'Gracias', nextMessage: '¡De nada! Lo mereces.' }, // Chat finaliza aquí
                    { text: 'No te creo', nextMessage: 'Bueno, tendrás que descubrirlo.' } // Chat finaliza aquí
                ]
            }
        ]
    }
};


// Función para mostrar el mensaje del evento actual
function displayEventMessage() {
    const chatWindow = document.getElementById('chat-window');

    // Mostrar el mensaje del evento actual con la imagen de Nicolás
    const eventMessage = document.createElement('div');
    eventMessage.classList.add('message', 'received');
    eventMessage.innerHTML = `<img src="${nicolasImage}" alt="Nicolas" class="profile-pic"><span>${conversation[currentEvent].message}</span>`;
    chatWindow.appendChild(eventMessage);
}

// Función para mostrar múltiples mensajes del bot con un retraso
function sendBotMessages(messages, callback) {
    const chatWindow = document.getElementById('chat-window');
    let i = 0;

    function sendNextMessage() {
        if (i < messages.length) {
            const receivedMessage = document.createElement('div');
            receivedMessage.classList.add('message', 'received');
            receivedMessage.innerHTML = `<img src="${nicolasImage}" alt="Nicolas" class="profile-pic"><span>${messages[i]}</span>`;
            chatWindow.appendChild(receivedMessage);

            // Desplazarse hacia abajo en el chat
            chatWindow.scrollTop = chatWindow.scrollHeight;

            i++;
            setTimeout(sendNextMessage, 1000); // Retraso de 1 segundo entre mensajes
        } else if (callback) {
            callback(); // Ejecutar el callback (opciones de respuesta) después de enviar todos los mensajes
        }
    }

    sendNextMessage();
}

// Función para enviar el mensaje del usuario y mostrar las nuevas opciones
function sendResponse(responseText) {
    const chatWindow = document.getElementById('chat-window');

    // Añadir el mensaje enviado por el usuario con la imagen de May
    const sentMessage = document.createElement('div');
    sentMessage.classList.add('message', 'sent');
    sentMessage.innerHTML = `<img src="${mayImage}" alt="May" class="profile-pic"><span>${responseText}</span>`;
    chatWindow.appendChild(sentMessage);

    // Desplazarse hacia abajo en el chat
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Limpiar las opciones anteriores
    document.getElementById('options').innerHTML = '';

    // Buscar la respuesta seleccionada en las opciones actuales
    const selectedResponse = currentOptions.find(response => response.text === responseText);

    if (selectedResponse) {
        // Mostrar múltiples mensajes si es un array de mensajes
        if (selectedResponse.nextMessages) {
            sendBotMessages(selectedResponse.nextMessages, () => {
                if (selectedResponse.nextEvent) {
                    currentEvent = selectedResponse.nextEvent; // Cambiar al siguiente evento
                    displayEventMessage();
                    generateOptions(conversation[currentEvent].responses);
                } else {
                    // Verificar si hay nuevas opciones o si la conversación ha terminado
                    if (selectedResponse.nextOptions) {
                        generateOptions(selectedResponse.nextOptions);
                    } else {
                        // No hay más eventos ni opciones, finalizar la conversación
                        console.log('Chat finalizado.');
                    }
                }
            });
        } else {
            // Si no hay múltiples mensajes, enviar solo un mensaje
            const receivedMessage = document.createElement('div');
            receivedMessage.classList.add('message', 'received');
            receivedMessage.innerHTML = `<img src="${nicolasImage}" alt="Nicolas" class="profile-pic"><span>${selectedResponse.nextMessage}</span>`;
            chatWindow.appendChild(receivedMessage);

            chatWindow.scrollTop = chatWindow.scrollHeight;

            // Verificar si hay un próximo evento o si la conversación debe finalizar
            if (selectedResponse.nextEvent) {
                currentEvent = selectedResponse.nextEvent;
                displayEventMessage();
                generateOptions(conversation[currentEvent].responses);
            } else if (selectedResponse.nextOptions) {
                generateOptions(selectedResponse.nextOptions);
            } else {
                // No hay más eventos ni opciones, finalizar la conversación
                console.log('Chat finalizado.');
            }
        }
    }
}

// Generar opciones de respuesta
function generateOptions(options) {
    currentOptions = options; // Actualizar las opciones actuales
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpiar opciones anteriores
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => sendResponse(option.text);
        optionsDiv.appendChild(button);
    });
}

// Iniciar el chat mostrando el mensaje del evento actual y las opciones
displayEventMessage();
generateOptions(conversation[currentEvent].responses);
