async function dataSendListener() {
    const form = document.querySelector('#popupContent').querySelector('form')
    console.log(form)
    if (form) {
        form.querySelector('#addAnswer').addEventListener('click', addAnswerField)

        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const question = form.querySelector('#question').value;
            const answers = [...form.querySelector('#answersContainer').children].map(child => child.value)
            const data = { question, answers };
            const response = await (await fetch('/createPolling', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json()
            if (response.success) {
                const answers = response.answers.map(el => `<p>${el}</p>`).join('')
                const html = `<a class="coach-card" data-id="${response.id}" data-type="faq">
                                <button class="delete-btn faq-${response.id}">&times;</button>
                                <h3>${response.question}</h3>
                                ${answers}
                            </a>`
                document.querySelector('.coach-list').insertAdjacentHTML('beforeend', html)

            }
            console.log(response)
        })
    }
}

async function addAnswerField(e) {
    const container = document.querySelector('#popupContent').querySelector('#answersContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'answers[]';
    input.placeholder = `Ответ ${container.children.length + 1}`;
    input.required = true;
    container.appendChild(input);
}


[...document.querySelectorAll('.delete-btn')].forEach(async (button) => {
    console.log('im here')
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const pollingId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deletePolling/${pollingId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
})