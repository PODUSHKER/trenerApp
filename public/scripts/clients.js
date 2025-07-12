
async function dataSendListener() {
    const form = document.getElementById('popupContent').children[0]

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const data = [...form.querySelectorAll('input')].reduce((acc, el) => {
                acc[el.name] = el.value;
                return acc
            }, {})
            const tag = form.querySelector('select[name="tag"]')
            console.log(tag)
            
            const response = await (await fetch('/createClient', {
                method: 'post',
                body: JSON.stringify({...data, tag: tag.value}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json()

            if (response.success) {
                const card = `
                <a href="/client/${response.body['id']}" class="coach-card" data-id="${response.body['id']}" data-type="client">
                    <button class="delete-btn client-${response.body['id']}">&times;</button>
                    <p>${response.body['tagName']}</p>
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
        console.log('button')
        const clientId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deleteClient/${clientId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
})