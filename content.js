function fillTimeFields(totalHours) {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const durationInputs = document.querySelectorAll('input.duration-input.form-control');
        if (durationInputs.length === 0) {
            alert('Kunne ikke finde tidsfelter på siden.');
            return;
        }

        const hoursPerField = (totalHours / 5).toFixed(2);
        const hours = Math.floor(hoursPerField);
        const minutes = Math.round((hoursPerField - hours) * 60);

        const hoursString = hours.toString().padStart(2, '0');
        const minutesString = minutes.toString().padStart(2, '0');
        const timeString = `${hoursString}:${minutesString}`;

        durationInputs.forEach(input => {
            if (input.id !== 'quick_entry_form_rows_0_timesheets_5_duration' &&
                input.id !== 'quick_entry_form_rows_0_timesheets_6_duration' &&
                input.value.trim() === '') {
                input.value = timeString;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
}

function checkAndFill() {
    chrome.storage.sync.get(['autoFillEnabled', 'hoursPerWeek'], (data) => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        if (data.autoFillEnabled && dayOfWeek >= 1 && dayOfWeek <= 5) {
            const durationInputs = document.querySelectorAll('input.duration-input.form-control');
            let anyFilled = false;
            durationInputs.forEach(input => {
                if (input.id !== 'quick_entry_form_rows_0_timesheets_5_duration' &&
                    input.id !== 'quick_entry_form_rows_0_timesheets_6_duration' &&
                    input.value.trim() !== '') {
                    anyFilled = true;
                }
            });
            if (!anyFilled && data.hoursPerWeek) {
                fillTimeFields(data.hoursPerWeek);
            }
        }
    });
}

window.onload = function() {
    checkAndFill();
};