async function dataSendListener() {
    const form = document.getElementById('popupContent')?.querySelector('form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tag = form.querySelector('input[name="tag"]').value.trim();

            const response = await (await fetch('/createTag', {
                method: 'POST',
                body: JSON.stringify({ tag }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();

            if (response.success) {
                const card = `
                    <a href="/" class="coach-card" data-id="${response['id']}" data-type="tag">
                        <button class="delete-btn tag-${response['id']}">&times;</button>
                        <h3>${response['tagName']}</h3>
                    </a>`;
                const list = document.querySelector('.coach-list')
                list.insertAdjacentHTML('beforeend', card);
                const button = list.lastElementChild.querySelector('.delete-btn')
                toDeleteListener(button)
            }

            closePopup();
        });
    }
}

[...document.querySelectorAll('.delete-btn')].forEach(toDeleteListener)


function toDeleteListener(button) {
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const tagId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deleteTag/${tagId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
}