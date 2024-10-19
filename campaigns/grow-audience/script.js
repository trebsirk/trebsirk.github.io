// Function to create and display each tip element
function createTipElement(tip) {
  const tipDiv = document.createElement('div');
  tipDiv.classList.add('tip');
  tipDiv.classList.add('active');

  const title = document.createElement('h2');
  title.innerText = tip.title;
  title.addEventListener('click', () => {
    tipDiv.classList.toggle('active');
  });

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('tip-content');

  const ul = document.createElement('ul');

  for (const key in tip.content) {
    console.log("key = "+key);
    if (typeof tip.content[key] === 'string') {
      
      //const paragraph = document.createElement('p');
      const text = key.replace(/_/g, ' ');

      //paragraph.innerText = `${keytext}: ${tip.content[key]}`;
      //contentDiv.appendChild(paragraph);
      console.log("key = "+key+". content = "+tip.content[key]);
      console.log("text = "+text);

      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = `${text}: `;
      li.appendChild(strong);
      const tn = document.createTextNode(`${tip.content[key]}`);
      li.appendChild(tn);
      //li.innerText = `${subkey}: ${tip.content[key][subkey]}`;
      ul.appendChild(li);
      contentDiv.appendChild(ul);

    } else if (typeof tip.content[key] === 'object') {
      const listTitle = document.createElement('p');
      const text = key.replace(/_/g, ' ');
      //listTitle.innerText = `${key.replace(/_/g, ' ')}:`;
      listTitle.innerText = text;
      contentDiv.appendChild(listTitle);

      const ul = document.createElement('ul');
      for (const subkey in tip.content[key]) {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = subkey;
        console.log("this should be strong: "+subkey);
        console.log("tip.content[key][subkey]: "+tip.content[key][subkey]);
        li.appendChild(strong);
        const tn = document.createTextNode(`${tip.content[key][subkey]}`);
        li.appendChild(tn);
        //li.innerText = `${subkey}: ${tip.content[key][subkey]}`;
        ul.appendChild(li);
      }
      contentDiv.appendChild(ul);
    }
  }

  tipDiv.appendChild(title);
  tipDiv.appendChild(contentDiv);

  return tipDiv;
}

// Function to fetch JSON file and render the tips
function loadTips(url) {
  fetch(url)  // Replace with the path to your JSON file
    .then(response => response.json())
    .then(jsonData => {
      const tipsContainer = document.getElementById('tips-container');
      jsonData.tips.forEach(tip => {
        const tipElement = createTipElement(tip);
        tipsContainer.appendChild(tipElement);
      });
    })
    .catch(error => {
      console.error('Error loading the JSON file:', error);
    });
}

// Call the function to load the tips when the page loads
// window.onload = loadTips;

async function init(url) {
  // const playbookUrl = '../../data/compromised-node.json';
  loadTips(url);
  // const data = await loadTips(url);
  // populatePlaybook(data);
}