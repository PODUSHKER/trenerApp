async function dataSendListener() {

    const form = document.getElementById('popupContent')?.querySelector('#assignWorkoutForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const WorkoutId = form.querySelector('select[name="workoutId"]').value;
        const date = form.querySelector('input[name="date"]').value;
        const clientId = window.location.pathname.split('/').pop();

        // ul нет если нет записей

        const response = await (await fetch(`/assignWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ WorkoutId, date, clientId })
        })).json();
        console.log(response)
        if (response.success) {
            const html = `
            <li style="margin-bottom: 10px;">
                <strong>${response.Workout.title}</strong> — ${response.Workout.description}<br />
                <small>Назначено: ${new Date(response.dataValues.date).toLocaleDateString()}</small><br />
                <small>Тренер: ${response.User.fio}</small>
            </li>`
            let listPlace = document.querySelector('.activeWorkoutsList')
            if (!listPlace) {
                document.querySelector('.passiveWorkoutsList').outerHTML = `<ul style="padding-left: 20px;" class="activeWorkoutsList">${html}</ul>`;
                listPlace = document.querySelector('.activeWorkoutsList')
            }
            else listPlace.insertAdjacentHTML('beforeend', html);

        } else {
            alert('Ошибка при назначении тренировки');
        }

        closePopup();
    });

}

