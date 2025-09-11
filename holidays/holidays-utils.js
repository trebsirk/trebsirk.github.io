function displayNextUSHoliday() {
    // Define U.S. federal holidays for 2025 with their rules
    const holidays = [
        { name: "New Year's Day", month: 1, day: 1, rule: null },
        { name: "Martin Luther King Jr. Day", month: 1, day: 20, rule: "third Monday" }, // Approx for third Monday
        { name: "Presidents' Day", month: 2, day: 17, rule: "third Monday" }, // Approx for third Monday
        { name: "Memorial Day", month: 5, day: 26, rule: "last Monday" }, // Approx for last Monday
        { name: "Juneteenth", month: 6, day: 19, rule: null },
        { name: "Independence Day", month: 7, day: 4, rule: null },
        { name: "Labor Day", month: 9, day: 1, rule: "first Monday" }, // Approx for first Monday
        { name: "Columbus Day", month: 10, day: 13, rule: "second Monday" }, // Approx for second Monday
        { name: "Veterans Day", month: 11, day: 11, rule: null },
        { name: "Thanksgiving Day", month: 11, day: 27, rule: "fourth Thursday" }, // Approx for fourth Thursday
        { name: "Christmas Day", month: 12, day: 25, rule: null }
    ];

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
    const currentYear = today.getFullYear();

    // Function to get the nth occurrence of a specific weekday in a month
    function getNthWeekdayOfMonth(year, month, weekday, n) {
        const firstDay = new Date(year, month - 1, 1);
        let day = 1;
        let count = 0;
        while (count < n) {
            const date = new Date(year, month - 1, day);
            if (date.getDay() === weekday) {
                count++;
                if (count === n) return date;
            }
            day++;
            if (day > 31) break; // Prevent infinite loop
        }
        return null;
    }

    // Function to get the last occurrence of a weekday in a month
    function getLastWeekdayOfMonth(year, month, weekday) {
        const lastDay = new Date(year, month, 0).getDate();
        let day = lastDay;
        while (day > 0) {
            const date = new Date(year, month - 1, day);
            if (date.getDay() === weekday) return date;
            day--;
        }
        return null;
    }

    // Function to get the exact holiday date based on its rule
    function getHolidayDate(holiday, year) {
        if (!holiday.rule) {
            return new Date(year, holiday.month - 1, holiday.day);
        }
        switch (holiday.rule) {
            case "first Monday":
                return getNthWeekdayOfMonth(year, holiday.month, 1, 1);
            case "second Monday":
                return getNthWeekdayOfMonth(year, holiday.month, 1, 2);
            case "third Monday":
                return getNthWeekdayOfMonth(year, holiday.month, 1, 3);
            case "last Monday":
                return getLastWeekdayOfMonth(year, holiday.month, 1);
            case "fourth Thursday":
                return getNthWeekdayOfMonth(year, holiday.month, 4, 4);
            default:
                return new Date(year, holiday.month - 1, holiday.day);
        }
    }

    // Find the next holiday
    let nextHoliday = null;
    let minDaysUntil = Infinity;

    holidays.forEach(holiday => {
        let holidayDate = getHolidayDate(holiday, currentYear);
        if (holidayDate < today) {
            // If holiday has passed this year, check next year
            holidayDate = getHolidayDate(holiday, currentYear + 1);
        }
        const timeDiff = holidayDate - today;
        const daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        if (daysUntil < minDaysUntil) {
            minDaysUntil = daysUntil;
            nextHoliday = { ...holiday, date: holidayDate };
        }
    });

    // Update the text element
    const textElement = document.getElementById('holidayText');
    if (minDaysUntil === 0) {
        textElement.textContent = `Today is ${nextHoliday.name}!`;
    } else {
        textElement.textContent = `${minDaysUntil} day${minDaysUntil === 1 ? '' : 's'} until ${nextHoliday.name}`;
    }
    
    // cli display
    if (minDaysUntil === 0) {
        console.log(`Today is ${nextHoliday.name}!`);
    } else {
        console.log(`${minDaysUntil} day${minDaysUntil === 1 ? '' : 's'} until ${nextHoliday.name}`);
    }
}

displayNextUSHoliday();