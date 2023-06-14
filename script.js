var currentIndex = 0; // Tracks the current index of the displayed title

function displayTitleAndContent(title, content) {
  var container = document.getElementById('container');

  // Clear the container
  container.innerHTML = '';

  // Create HTML elements for the current title
  var titleElement = document.createElement('h1');
  titleElement.textContent = title;

  // Create a div element for the content lines
  var contentContainer = document.createElement('div');
  contentContainer.id = 'contentContainer';

  // Append the title and content container to the container
  container.appendChild(titleElement);
  container.appendChild(contentContainer);

  // Display the first line of content
  displayNextLine(contentContainer, content, 0);
}

function displayNextLine(container, content, lineIndex) {
  if (lineIndex < content.length) {
    // Create a paragraph element for the current line of content
    var lineElement = document.createElement('p');
    lineElement.textContent = content[lineIndex];

    // Append the line element to the content container
    container.appendChild(lineElement);

    // Schedule the display of the next line
    setTimeout(function() {
      displayNextLine(container, content, lineIndex + 1);
    }, 1000); // Adjust the delay (in milliseconds) between lines as needed
  } else {
    // Generate and display the image for the current content
    generateAndDisplayImage(content.join(' '));
  }
}

async function generateAndDisplayImage(text) {
  const response = await fetch('https://api.openai.com/v1/engines/davinci/codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_KEY' // Replace with your actual API key
    },
    body: JSON.stringify({
      prompt: text,
      max_tokens: 50
    })
  });

  if (!response.ok) {
    throw new Error('API response error');
  }

  const result = await response.json();

  if (result.choices && result.choices.length > 0) {
    const image = result.choices[0].image;
    // Display the generated image in the showroom div
    displayImage(image);
  } else {
    throw new Error('No choices found in the API response');
  }
}

function displayImage(imageUrl) {
  var showroom = document.getElementById('showroom');
  var imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  showroom.appendChild(imageElement);
}

function displayNextTitleAndContent() {
  if (currentIndex < titles.length) {
    var title = titles[currentIndex];
    var content = contents[currentIndex];
    displayTitleAndContent(title, content);
    currentIndex++;
  }
}

// Example usage
var fileURL = 'books/bigNursery.txt';
var titles = [];
var contents = [];

fetch(fileURL)
  .then(response => response.text())
  .then(data => {
    var lines = data.split('\n');
    var currentContent = [];

    lines.forEach(function(line) {
      if (/^[A-Z\s]+$/.test(line)) {
        if (currentContent.length > 0) {
          contents.push(currentContent);
          currentContent = [];
        }
        titles.push(line.trim());
      } else {
        currentContent.push(line.trim());
      }
    });

    if (currentContent.length > 0) {
      contents.push(currentContent);
    }

    var nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', displayNextTitleAndContent);

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(nextButton);

    // Display the first title and content
    displayNextTitleAndContent();
  })
  .catch(error => {
    console.error('Error:', error);
  });
