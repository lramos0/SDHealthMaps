// Function to simulate typing effect
function typeTerminalLine(targetElement, text, typingSpeed = 50) {
  let charIndex = 0;

  function typeCharacter() {
    if (charIndex < text.length) {
      targetElement.innerHTML += text[charIndex]; // Append one character
      charIndex++;
      setTimeout(typeCharacter, typingSpeed); // Delay for typing effect
    }
  }

  typeCharacter(); // Start the typing effect
}

// Add event listener to run the typing effect after page load
window.addEventListener('load', () => {
  const terminalContent = document.getElementById('terminal-content');
  const terminalLine = document.createElement('div');
  terminalLine.className = 'terminal-line';

  // Prepend the new terminal line to the terminal content
  terminalContent.prepend(terminalLine);

  const textToType = "Here are some healthcare facilities, type a command to compare:";
  typeTerminalLine(terminalLine, textToType, 50); // Start typing with a speed of 50ms per character
});
