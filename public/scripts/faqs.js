async function dataSendListener() {
    const form = document.querySelector('#popupContent').querySelector('form')
    console.log(form)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const question = form.querySelector('input').value;
            const answer = form.querySelector('textarea').value;
            const data = { question, answer };
            const response = await (await fetch('/createFAQ', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json()
            if (response.success) {
                const html = `<a class="coach-card" data-id="${response.id}" data-type="faq">
                                <button class="delete-btn faq-${response.id}">&times;</button>
                                <h3>${response.question}</h3>
                                <p>${response.answer}</p>
                            </a>`
                console.log(html)
                document.querySelector('.coach-list').insertAdjacentHTML('beforeend', html)
            }
            closePopup()
            console.log(response)
        })
    }
}

[...document.querySelectorAll('.delete-btn')].forEach(async (button) => {
    console.log('im here')
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const faqId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deleteFAQ/${faqId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
})