
async function getForm(url) {
    const form = document.getElementById('popupContent').children[0]
    return form;
}

function openPopup(contentId) {
    const content = document.getElementById(contentId)?.innerHTML;
    if (content) {
        document.getElementById('popupContent').innerHTML = content;
        document.getElementById('popup').style.display = 'flex';
        dataSendListener()
    }
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popupContent').innerHTML = '';
}

function togglePasswordVisibility(button){
    const password = button.previousElementSibling
    if (password.type === 'password')password.type = 'text';
    else password.type = 'password';
}

async function deleteRecord(type, id, element) {
    const confirmed = confirm("Вы действительно хотите удалить эту запись?");
    if (!confirmed) return;

    const response = await (await fetch(`/delete${capitalize(type)}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })).json();

    if (response.success) {
        element.remove();
    } else {
        alert("Ошибка при удалении");
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
