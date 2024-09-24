// Select the audio element
const backgroundMusic = document.getElementById('backgroundMusic');

// Play the audio when the page loads
window.addEventListener('load', () => {
  backgroundMusic.play();
});

// Listen for keydown events
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyM') {
    if (!backgroundMusic.paused) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play();
    }
  }
});

// Existing code
setTimeout(() => {
  instructionsMenu.style.opacity = '1'; // Trigger fade-in
}, 10); // Small delay to ensure display change is applied



document.addEventListener('DOMContentLoaded', (event) => {
  const instructionsMenu = document.getElementById('instructionsMenu');
  const closeButton = document.getElementById('closeButton');
  const helpButton = document.getElementById('helpButton');
  const shapeDescription = document.getElementById('shapeDescription');

  const shapeDescriptions = [
    "Traveling around the world is my dream. I want to see the world.",
    "I can be a super star. Many people will know me. I will be famous.",
    "Sometimes, I just want to be a cat. Eat, sleep, and play all day.",
    "Maybe this is the dream that the most realistic one. I can be a great photographer.",
    "The most crazy dream I ever had was being a author of a book. But who knows?"
  ];
  const stateDescriptions = {
    flowField: "At the end, I just go with the flow and see where it takes me.",
    anchors: "This is the flow of our life, specifically mine."
  };

  closeButton.addEventListener('click', () => {
    instructionsMenu.style.display = 'none';
    instructionsMenu.style.opacity = '0'; // Reset opacity
  });

  helpButton.addEventListener('click', () => {
    instructionsMenu.style.display = 'block';
    setTimeout(() => {
      instructionsMenu.style.opacity = '1'; // Trigger fade-in
    }, 10); // Small delay to ensure display change is applied
  });

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      isMovingToShape = true;
      isUsingFlowField = false;
      currentShape = (currentShape - 1 + shapeDescriptions.length) % shapeDescriptions.length; // Move to the previous shape
      createShapeAnchors(currentShape);
      shapeDescription.textContent = shapeDescriptions[currentShape];
      shapeDescription.style.display = 'block'; // Ensure it is displayed
      setTimeout(() => {
        shapeDescription.style.opacity = '1'; // Trigger fade-in
      }, 10); // Small delay to ensure display change is applied
      setTimeout(() => {
        shapeDescription.style.opacity = '1'; // Fade out after 3 seconds
        setTimeout(() => {
          shapeDescription.style.display = 'none'; // Hide after fade-out
        }, 500); // Match this duration with your CSS transition duration
      }, 30000);
    }
  });

  // Listen for custom events from sketch.js
  document.addEventListener('flowField', () => {
    shapeDescription.textContent = stateDescriptions.flowField;
    shapeDescription.style.display = 'block';
    setTimeout(() => {
      shapeDescription.style.opacity = '1';
    }, 10);
    setTimeout(() => {
      shapeDescription.style.opacity = '1';
      setTimeout(() => {
        shapeDescription.style.display = 'none';
      }, 500);
    }, 30000);
  });

  document.addEventListener('anchors', () => {
    shapeDescription.textContent = stateDescriptions.anchors;
    shapeDescription.style.display = 'block';
    setTimeout(() => {
      shapeDescription.style.opacity = '1';
    }, 10);
    setTimeout(() => {
      shapeDescription.style.opacity = '0';
      setTimeout(() => {
        shapeDescription.style.display = 'none';
      }, 500);
    }, 30000);
  });
});
