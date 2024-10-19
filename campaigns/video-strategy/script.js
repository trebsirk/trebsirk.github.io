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

  const description = document.createElement('p');
  description.innerText = tip.description;

  // Create the details unordered list
  const detailsSection = document.createElement('div');
  const detailsHeader = document.createElement('h5');
  detailsHeader.innerText = "Details";
  detailsSection.appendChild(detailsHeader);

  const detailsUl = document.createElement('ul');
  detailsSection.appendChild(detailsUl);
  detailsUl.classList.add('details');
  for (const key in tip.details) {
    const detailLi = document.createElement('li');
    if (typeof tip.details[key] === 'string') {
      detailLi.innerText = `${key.replace(/_/g, ' ')}: ${tip.details[key]}`;
      detailsUl.appendChild(detailLi);
    } // else list of suggestions, which are displayed in next section      
  }

  // Create the suggestions unordered list
  const suggestionsSection = document.createElement('div');
  const suggestionsHeader = document.createElement('h5');
  suggestionsHeader.innerText = "Suggestions";
  suggestionsSection.appendChild(suggestionsHeader);

  const suggestionsUl = document.createElement('ul');
  suggestionsUl.classList.add('suggestions');
  suggestionsSection.appendChild(suggestionsUl);

  const liTitle = document.createElement('li');
  // const suggestionsTitle = document.createElement('p');
  // suggestionsTitle.innerText = 'Suggestions:';
  // tipDiv.appendChild(suggestionsTitle);

  tip.details.suggestions.forEach(suggestion => {
    //console.log("suggestion = " + suggestion);
    const suggestionLi = document.createElement('li');
    suggestionLi.innerText = suggestion;
    suggestionsUl.appendChild(suggestionLi);
  });

  // Append elements to tipDiv
  tipDiv.appendChild(title);
  
  contentDiv.appendChild(description);
  contentDiv.appendChild(detailsSection);
  contentDiv.appendChild(suggestionsSection);
  tipDiv.appendChild(contentDiv);
  //detailsUl.appendChild(suggestionsUl);
  //tipDiv.appendChild(suggestionsUl);

  // Add the tipDiv to the container
  //contentContainer.appendChild(tipDiv);
  

  return tipDiv;
};


// Function to display the content from the JSON file
function displayContent(data) {

  const contentContainer = document.getElementById('tips-container');

  data.content.forEach(content => {
    const tipDiv = document.createElement('div');
    tipDiv.classList.add('tip');
    tipDiv.classList.add('active');

    const title = document.createElement('h2');
    title.innerText = content.title;
    title.addEventListener('click', () => {
      tipDiv.classList.toggle('active');
    });

    const description = document.createElement('p');
    description.innerText = content.description;

    // Create the details unordered list
    const detailsSection = document.createElement('div');
    const detailsHeader = document.createElement('h5');
    detailsHeader.innerText = "Details";
    detailsSection.appendChild(detailsHeader);

    const detailsUl = document.createElement('ul');
    detailsSection.appendChild(detailsUl);
    detailsUl.classList.add('details');
    for (const key in content.details) {
      const detailLi = document.createElement('li');
      if (typeof content.details[key] === 'string') {
        detailLi.innerText = `${key.replace(/_/g, ' ')}: ${content.details[key]}`;
        detailsUl.appendChild(detailLi);
      } // else list of suggestions, which are displayed in next section      
    }

    // Create the suggestions unordered list
    const suggestionsSection = document.createElement('div');
    const suggestionsHeader = document.createElement('h5');
    suggestionsHeader.innerText = "Suggestions";
    suggestionsSection.appendChild(suggestionsHeader);

    const suggestionsUl = document.createElement('ul');
    suggestionsUl.classList.add('suggestions');
    suggestionsSection.appendChild(suggestionsUl);

    const liTitle = document.createElement('li');
    // const suggestionsTitle = document.createElement('p');
    // suggestionsTitle.innerText = 'Suggestions:';
    // tipDiv.appendChild(suggestionsTitle);

    content.details.suggestions.forEach(suggestion => {
      //console.log("suggestion = " + suggestion);
      const suggestionLi = document.createElement('li');
      suggestionLi.innerText = suggestion;
      suggestionsUl.appendChild(suggestionLi);
    });

    // Append elements to tipDiv
    tipDiv.appendChild(title);
    tipDiv.appendChild(description);
    tipDiv.appendChild(detailsSection);
    tipDiv.appendChild(suggestionsSection);
    //detailsUl.appendChild(suggestionsUl);
    //tipDiv.appendChild(suggestionsUl);

    // Add the tipDiv to the container
    contentContainer.appendChild(tipDiv);
  });
}


// Function to fetch JSON file and render the tips
function displayTips(data) {
  const tipsContainer = document.getElementById('tips-container');
  data.tips.forEach(tip => {
    const tipElement = createTipElement(tip);
    tipsContainer.appendChild(tipElement);
  });
}

async function loadTips(url) {
  const data = await fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error('Error loading the JSON file:', error);
    });
  return data;
}

async function init(url) {
  data = await loadTips(url);
  // displayContent(data);
  displayTips(data);
}

