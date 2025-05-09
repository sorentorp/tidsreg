document.addEventListener('DOMContentLoaded', () => {
    const hoursInput = document.getElementById('hoursPerWeek');
    const fillButton = document.getElementById('fillTimes');
    const autoFillCheckbox = document.getElementById('autoFillCheckbox');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.sync.get(['hoursPerWeek', 'autoFillEnabled'], (data) => {
        if (data.hoursPerWeek) {
            hoursInput.value = data.hoursPerWeek;
        }
        autoFillCheckbox.checked = data.autoFillEnabled || false;
    });

    fillButton.addEventListener('click', () => {
        const hours = parseFloat(hoursInput.value);
        if (isNaN(hours) || hours <= 0) {
            statusDiv.textContent = 'Indtast venligst et gyldigt antal timer.';
            return;
        }
        chrome.storage.sync.set({ 'hoursPerWeek': hours }); // Save hours
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: fillTimeFields,
                args: [hours]
            });
        });
    });

    autoFillCheckbox.addEventListener('change', () => {
        const autoFillEnabled = autoFillCheckbox.checked;
        chrome.storage.sync.set({ 'autoFillEnabled': autoFillEnabled }); // Save autofill setting
    });

    // Check if autofill should be triggered on page load
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: checkAndFill,
        });
    });
});

function checkAndFill() {
    chrome.storage.sync.get(['autoFillEnabled', 'hoursPerWeek'], (data) => {
        if (data.autoFillEnabled) {
            const durationInputs = document.querySelectorAll('input.duration-input.form-control');
            let anyFilled = false;
            durationInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    anyFilled = true;
                }
            });
            if (!anyFilled && data.hoursPerWeek) {
                fillTimeFields(data.hoursPerWeek);
            }
        }
    });
}