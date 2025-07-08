function toggleLesson(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('open');
    const arrow = header.querySelector('.toggle-arrow');
    arrow.textContent = content.classList.contains('open') ? '▲' : '▼';
}


async function updateLesson(lessonId) {
    const container = document.querySelector('#lesson_' + lessonId);
    const content = container.querySelector('.lesson-edit-area').value;

    const response = await (await fetch(location.href + `/updateLesson/${lessonId}`, {
        method: 'post',
        body: JSON.stringify({ content }),
        headers: {
            'Content-Type': 'application/json'
        }
    })).json()

    if (response.success) {
        document.getElementById('success-msg').innerHTML = 'Данные успешно изменены!'
    }
}
async function deleteLesson(lessonId) {

    const response = await (await fetch(location.href + `/deleteLesson/${lessonId}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })).json()

    if (response.success) {
        const container = document.getElementById('lesson_' + lessonId)
        container.outerHTML = '';
    }
}


function openModuleForm() {
    document.getElementById('newModuleForm').style.display = 'block';
    document.getElementById('addModuleForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const title = form.title.value.trim();
        const description = form.description.value.trim();
        const data = { title, description };

        const response = await (await fetch(location.href + '/addModule', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();

        if (response.success) {
            location.reload(); // пока просто перезагружаем, можно вставлять вручную
        }
    });
}

function openLessonForm(moduleId) {
    document.getElementById(`newLessonForm_${moduleId}`).style.display = 'block';
}

async function submitLesson(e, moduleId) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const content = form.content.value.trim();

    const data = { title, content };
    const response = await (await fetch(`${location.href}/module/${moduleId}/addLesson`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })).json();

    if (response.success) {
        location.reload(); // тоже можно заменить на вставку DOM-элемента
    }
}