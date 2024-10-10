// Function to load the JSON playbook file from the provided URL
async function loadPlaybook(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading playbook:', error);
        displayErrorMessage();
    }
}

// Function to populate the playbook data into HTML
function populatePlaybook(data) {
    console.log(data);
    const container = document.getElementById('playbookContainer');
    container.innerHTML = '';  // Clear the initial loading message

    // Create playbook title
    const title = document.createElement('h1');
    title.textContent = data.playbook.title;
    container.appendChild(title);

    // Keep track of section numbers
    let sectionNumber = 1;

    // Loop through sections and create section HTML
    data.playbook.sections.forEach((section) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');

        // Create section title with numbering
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = `${sectionNumber}. ${section.section_title}`;
        sectionDiv.appendChild(sectionTitle);

        // Create ul for tasks
        const taskList = document.createElement('ul');

        // Loop through tasks and create li elements
        section.tasks.forEach((task) => {
            const taskItem = document.createElement('li');
            taskItem.textContent = task;
            taskList.appendChild(taskItem);
        });

        // Append the task list to the section div
        sectionDiv.appendChild(taskList);
        container.appendChild(sectionDiv);

        // Increment section number
        sectionNumber++;
    });
}

// Function to display an error message in case of load failure
function displayErrorMessage() {
    const container = document.getElementById('playbookContainer');
    container.innerHTML = '<h1 class="loading">Failed to load the playbook.</h1>';
}


async function init(url) {
    // const playbookUrl = '../../data/compromised-node.json';
    const data = await loadPlaybook(url);
    populatePlaybook(data);
}