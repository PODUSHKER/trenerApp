
async function dataSendListener() {
    const form = document.getElementById('popupContent').children[0]

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const data = [...form.querySelectorAll('input')].reduce((acc, el) => {
                acc[el.name] = el.value;
                return acc
            }, {})
            const response = await (await fetch('/createTrener', {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json()
            if (response.success) {
                const card = `
                <a href="/trener/${response.body['id']}" class="coach-card">
                    <h3>${response.body['fio']}</h3>
                    <p>${response.body['phone']}</p>
                </a>`
                document.querySelector('.coach-list').insertAdjacentHTML('beforeend', card)
            }
            closePopup()
        })
    }
}

[...document.querySelectorAll('.delete-btn')].forEach(async (button) => {
    console.log('im here')
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const trenerId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deleteTrener/${trenerId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
})