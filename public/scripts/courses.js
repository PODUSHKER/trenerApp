async function dataSendListener() {
    const form = document.getElementById('popupContent').querySelector('form');
    const moduleContainer = form.querySelector('#moduleContainer');

    const moduleTitleInput = form.querySelector('#moduleTitleInput');
    const moduleDescriptionInput = form.querySelector('#moduleDescriptionInput');
    const lessonTitleInput = form.querySelector('#lessonTitleInput');
    const lessonContentInput = form.querySelector('#lessonContentInput');

    const lessonContainer = form.querySelector('.lessonContainer');
    const addLessonBtn = form.querySelector('#addLessonBtn');
    const addModuleBtn = form.querySelector('#addModuleBtn');

    let tempLessons = [];

    // Добавление урока в текущий модуль
    addLessonBtn.addEventListener('click', () => {
        const lessonTitle = lessonTitleInput.value.trim();
        const lessonContent = lessonContentInput.value.trim();

        if (!lessonTitle || !lessonContent) return;

        tempLessons.push({ title: lessonTitle, content: lessonContent });

        const preview = document.createElement('div');
        preview.className = 'lesson-preview';
        preview.textContent = lessonTitle;
        lessonContainer.appendChild(preview);

        lessonTitleInput.value = '';
        lessonContentInput.value = '';
    });

    // Добавление модуля (с накопленными уроками)
    addModuleBtn.addEventListener('click', () => {
        const moduleTitle = moduleTitleInput.value.trim();
        const moduleDescription = moduleDescriptionInput.value.trim();

        if (!moduleTitle || !tempLessons.length) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'module-wrapper';

        const hiddenModuleTitle = document.createElement('input');
        hiddenModuleTitle.type = 'hidden';
        hiddenModuleTitle.name = 'modules[][title]';
        hiddenModuleTitle.value = moduleTitle;

        const hiddenModuleDescription = document.createElement('input');
        hiddenModuleDescription.type = 'hidden';
        hiddenModuleDescription.name = 'modules[][description]';
        hiddenModuleDescription.value = moduleDescription;

        wrapper.appendChild(hiddenModuleTitle);
        wrapper.appendChild(hiddenModuleDescription);

        // Уроки внутри модуля
        tempLessons.forEach(lesson => {
            const lessonTitle = document.createElement('input');
            lessonTitle.type = 'hidden';
            lessonTitle.name = 'modules[][lessons][][title]';
            lessonTitle.value = lesson.title;

            const lessonContent = document.createElement('input');
            lessonContent.type = 'hidden';
            lessonContent.name = 'modules[][lessons][][content]';
            lessonContent.value = lesson.content;

            wrapper.appendChild(lessonTitle);
            wrapper.appendChild(lessonContent);
        });

        const modulePreview = document.createElement('div');
        modulePreview.className = 'module-preview';
        modulePreview.innerHTML = `<strong>${moduleTitle}</strong> (${tempLessons.length} уроков)`;
        wrapper.appendChild(modulePreview);

        moduleContainer.appendChild(wrapper);

        // Сброс полей
        moduleTitleInput.value = '';
        moduleDescriptionInput.value = '';
        lessonContainer.innerHTML = '';
        tempLessons = [];
    });

    // Отправка всей формы
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const courseTitle = form.querySelector('.courseTitle').value.trim();
        const courseDescription = form.querySelector('.courseDescription').value.trim();

        const modules = [];

        moduleContainer.querySelectorAll('.module-wrapper').forEach(wrapper => {
            const moduleTitle = wrapper.querySelector('input[name="modules[][title]"]').value;
            const moduleDescription = wrapper.querySelector('input[name="modules[][description]"]').value;

            const lessonInputs = wrapper.querySelectorAll('input[name="modules[][lessons][][title]"]');
            const contentInputs = wrapper.querySelectorAll('input[name="modules[][lessons][][content]"]');

            const lessons = Array.from(lessonInputs).map((_, i) => ({
                title: lessonInputs[i].value,
                content: contentInputs[i].value
            }));

            modules.push({ title: moduleTitle, description: moduleDescription, lessons });
        });

        const data = {
            courseTitle,
            courseDescription,
            modules
        };

        const response = await (await fetch('/createCourse', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();

        if (response.success) {
            const container =
                `<a class="coach-card" href="/course/${response.id}">
                    <h3>${response.title}</h3>
                    <p class="course-description">${response.shortDescription}</p>
                </a>`;
            document.querySelector('.coach-list').insertAdjacentHTML('beforeend', container);
        }
        closePopup();
    });
}


[...document.querySelectorAll('.delete-btn')].forEach(async (button) => {
    console.log('im here')
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const courseId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deleteCourse/${courseId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
})