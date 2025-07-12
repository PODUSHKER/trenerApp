async function dataSendListener() {
    const form = document.getElementById('popupContent')?.querySelector('#createWorkoutForm');
    if (!form) return;

    const itemsContainer = form.querySelector('#itemsContainer');
    const addBtn = form.querySelector('#addWorkoutItem');

    addBtn.addEventListener('click', async () => {
        const item = document.createElement('div');
        item.className = 'workout-item';
        const units = [...(await (await fetch('/getUnits', { method: 'POST' })).json())['units']].map(el => `<option value="${el.id}">${el.name}</option>`).join('')


        console.log(units)
        item.innerHTML = `
      <input type="text" name="name" placeholder="Упражнение" required />
      <input type="number" name="num" placeholder="Повторения" required />
      <select name="unit" required>
        ${units}
      </select>
      <button type="button" class="remove-btn" title="Удалить">×</button>
    `;

        item.querySelector('.remove-btn').addEventListener('click', () => item.remove());
        itemsContainer.appendChild(item);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            title: form.title.value,
            description: form.description.value,
            tag: form.tag.value,
            items: [...form.querySelectorAll('.workout-item')].map(row => ({
                name: row.querySelector('input[name="name"]').value,
                num: row.querySelector('input[name="num"]').value,
                unit: row.querySelector('select[name="unit"]').value
            }))
        };
        console.log(data.tag)
        const response = await fetch('/createWorkout', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (result.success) {
            closePopup();
            location.reload();
        } else {
            alert('Ошибка при создании тренировки');
        }
    });
}


[...document.querySelectorAll('.delete-btn')].forEach(async (button) => {
    console.log('im here')
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        const workoutId = button.classList[1].split('-')[1];
        const response = await (await fetch(`/deleteWorkout/${workoutId}`, {
            method: 'post',

        })).json()

        if (response.success) {
            button.parentElement.outerHTML = ''
        }
    })
})