document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const scheduleBody = document.getElementById('schedule-body');
    const clearBtn = document.getElementById('clear-btn');
    const printBtn = document.getElementById('print-btn');

    let classes = JSON.parse(localStorage.getItem('schedule_classes')) || [];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Function to save to LocalStorage
    const saveToLocalStorage = () => {
        localStorage.setItem('schedule_classes', JSON.stringify(classes));
    };

    // Function to create time slots (Hourly from 08:00 to 18:00)
    const createTimeSlots = () => {
        scheduleBody.innerHTML = '';
        for (let hour = 8; hour <= 17; hour++) {
            const row = document.createElement('tr');
            
            // Time Column
            const timeCol = document.createElement('td');
            timeCol.className = 'time-col';
            timeCol.textContent = `${hour.toString().padStart(2, '0')}:00`;
            row.appendChild(timeCol);

            // Day Columns
            days.forEach(day => {
                const dayCol = document.createElement('td');
                dayCol.dataset.day = day;
                dayCol.dataset.hour = hour;
                
                // Find classes that start in this hour
                const hourClasses = classes.filter(c => c.day === day && parseInt(c.startTime.split(':')[0]) === hour);
                
                hourClasses.forEach(c => {
                    const card = createClassCard(c);
                    dayCol.appendChild(card);
                });

                row.appendChild(dayCol);
            });

            scheduleBody.appendChild(row);
        }
    };

    const createClassCard = (classObj) => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.style.backgroundColor = classObj.color;
        
        card.innerHTML = `
            <h4>${classObj.subject}</h4>
            <div class="time-range">${classObj.startTime} - ${classObj.endTime}</div>
            <button class="delete-btn" data-id="${classObj.id}">✕</button>
        `;

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            classes = classes.filter(c => c.id !== id);
            saveToLocalStorage();
            createTimeSlots();
        });

        return card;
    };

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newClass = {
            id: Date.now().toString(),
            subject: document.getElementById('subject').value,
            day: document.getElementById('day').value,
            startTime: document.getElementById('start-time').value,
            endTime: document.getElementById('end-time').value,
            color: document.getElementById('color').value
        };

        classes.push(newClass);
        saveToLocalStorage();
        createTimeSlots();
        form.reset();
        document.getElementById('color').value = '#6366f1';
    });

    // Handle Clear
    clearBtn.addEventListener('click', () => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างตารางทั้งหมด?')) {
            classes = [];
            saveToLocalStorage();
            createTimeSlots();
        }
    });

    // Handle Print
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Initial Render
    createTimeSlots();
});
