document.addEventListener("DOMContentLoaded", () => {
  const commandForm = document.getElementById("command-form");
  const commandInput = document.getElementById("command-input");
  const terminalContent = document.getElementById("terminal-content");
  const mapContainer = document.querySelector(".embed-container");
  const openAI_API_KEY = 'to_be_replaced'
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openAI_API_KEY}`,
  };
  var report = false

  const mapConfig = {
    ls: `<style>.embed-container {position: relative; padding-bottom: 80%; height: 0; max-width: 100%;} .embed-container iframe, .embed-container object, .embed-container iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} small{position: absolute; z-index: 40; bottom: 0; margin-bottom: -15px;}</style><div class="embed-container"><iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="test2" src="//sdsugeo.maps.arcgis.com/apps/Embed/index.html?webmap=0b31866fc6a340aba0d7608396915088&extent=-117.5567,32.591,-116.7355,33.067&zoom=true&previewImage=false&scale=true&disable_scroll=true&theme=light"></iframe></div>
                 <iframe
                         width="500"
                         height="400"
                         frameborder="0"
                         scrolling="no"
                         marginheight="0"
                         marginwidth="0"
                         title="Healthcare Map"
                         src="https://sdsugeo.maps.arcgis.com/apps/Embed/index.html?webmap=0b31866fc6a340aba0d7608396915088&extent=-117.5567,32.591,-116.7355,33.067&zoom=true&previewImage=false&scale=true&disable_scroll=true&theme=light">
                 </iframe>`,
    impact: `<arcgis-embedded-map style="height:100vh;width:100vw;" item-id="be0e15d414f646bd8fbe9e3f513de101" theme="light" portal-url="https://sdsugeo.maps.arcgis.com" legend-enabled share-enabled></arcgis-embedded-map>`,
    density: `<arcgis-embedded-map style="height:100vh;width:100vw;" item-id="7170a91ffea24004957c77af62e92325" theme="light" portal-url="https://sdsugeo.maps.arcgis.com"  legend-enabled ></arcgis-embedded-map>`,
    index: `<arcgis-embedded-map style="height:100vh;width:100vw;" item-id="42fb18f515354841851ecca89d2b4ce5" theme="light" portal-url="https://sdsugeo.maps.arcgis.com" legend-enabled share-enabled></arcgis-embedded-map>`,
    income: `<arcgis-embedded-map style="height:100vh;width:100vw;" item-id="f72a3f72a42e47228d6cd84eae097953" theme="light" portal-url="https://sdsugeo.maps.arcgis.com" legend-enabled information-enabled></arcgis-embedded-map>`,
    mode: report,
  };

  const mapDesc = {
    ls: '[INFO] here are local hospitals which are open as of today',
    impact: '[INFO] these are how such healthcare facilities impact local healthy indexes',
    density: '[INFO] density can be understood as the number of health facilities in a fixed area',
    index: '[INFO] here is a map highlighting local healthy indexes',
    income: '[INFO] income surprisingly has very little impact on facility density'
  };

  let isUserAtBottom = true;

  terminalContent.addEventListener("scroll", () => {
    const isAtBottom = terminalContent.scrollHeight - terminalContent.scrollTop === terminalContent.clientHeight;
    isUserAtBottom = isAtBottom;
  });

  // Function to type out terminal messages gradually
    function typeMessage(message, delay = 50) {
      return new Promise((resolve) => {
        const line = document.createElement("div");
        line.classList.add("terminal-line");
        terminalContent.appendChild(line);

        let index = 0;

        function typeChar() {
          if (index < message.length) {
            line.textContent += message[index];
            index++;
            setTimeout(typeChar, delay);
            // Scroll to the bottom of the content container
            terminalContent.scrollTop = terminalContent.scrollHeight;
          } else {
            resolve();
          }
        }

        typeChar();
      });
    }


    // Function to replace map content dynamically
    function replaceMap(command) {
      if (mapConfig[command]) {
        mapContainer.innerHTML = mapConfig[command]; // Replace content

        // Force re-render for ArcGIS custom elements
        const arcgisMap = mapContainer.querySelector("arcgis-embedded-map");
        if (arcgisMap && arcgisMap.connectedCallback) {
          arcgisMap.connectedCallback();
        }
      } else {
        typeMessage(`[ERROR] Invalid command: ${command}`);
      }
    }
    // Function to handle form submission
    function appendToMap(command) {
      if (mapConfig[command]) {
        // Create a new container for the embedded map
        const embeddedContainer = document.createElement('div');
        embeddedContainer.classList.add('embed-container');
        embeddedContainer.innerHTML = mapConfig[command];

        // Create a new map container and insert the embedded container into it
        const newMapContainer = document.createElement('div');
        newMapContainer.classList.add('map-container');
        newMapContainer.appendChild(embeddedContainer); // Use appendChild to add the embedded container

        // Append the new map container to the terminal content
        const terminalContent = document.getElementById("terminal-content");
        terminalContent.appendChild(newMapContainer);

        // Force re-render for ArcGIS custom elements (e.g., arcgis-embedded-map)
        const arcgisMap = newMapContainer.querySelector("arcgis-embedded-map");
        if (!isUserAtBottom) {
           content.scrollTop = content.scrollHeight;
        }
        if (arcgisMap && arcgisMap.connectedCallback) {
          arcgisMap.connectedCallback();
        }

      } else {
        // Handle invalid command
        typeMessage(`[ERROR] Invalid command: ${command}`);
      }
    }

    // Function to send the command to OpenAI API and get a response
  async function sendToChatGPT(command) {
    const body = JSON.stringify({
      model: 'gpt-4o-mini', // Or 'gpt-4' if you're using GPT-4
      messages: [
        { role: 'user', content: command }
      ],
      "temperature": 0.7
    });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAI_API_KEY}`,
        },
        body: body,
      });

      const data = await response.json();

      // Check if the response is ok (status code in the 200-299 range)
      if (!data) {
        console.error('HTTP error:', response.status, response.statusText);
        return '[ERROR] Failed to fetch from OpenAI API.';
      }

      // Log the full response to inspect its structure
      console.log('OpenAI response:', data);

      // Check if 'choices' exists and is an array with at least one item
      if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        console.error('No valid "choices" in response:', data);
        return '[ERROR] No valid response from OpenAI API.';
      }
    } catch (error) {
      // Catch any error that occurs during the fetch or response handling
      console.error('Error fetching response from OpenAI:', error);
      return '[ERROR] Failed to communicate with the AI service.';
    }
  }


  // Function to handle form submission
    function handleCommand(event) {
      const element = document.getElementById("bod");
      event.preventDefault();
      const command = commandInput.value.trim().toLowerCase(); // Normalize command input
      if (command == 'mode') {
        report = !report;
        mode = report ? 'report' : 'default';
        typeMessage(`[INFO] producing results using ${mode} mode`);
        commandInput.value = ""; // Clear input
      }
      else if (mapConfig[command]) {
        typeMessage(`[INFO] Executing command: ${command}`).then(() => {
          report ? appendToMap(command) : replaceMap(command);
        });
        commandInput.value = ""; // Clear input
      }
      else {
        typeMessage(`[INFO] Thinking about: ${command}`).then(() => {
          // Call sendToChatGPT, which returns a Promise.
          sendToChatGPT(command).then(response => {
            // Now that the promise is resolved, we have the content as a string.
            typeMessage(`[gpt-4o-mini] ${response}`);  // Display the content from ChatGPT
          }).catch(error => {
            console.error('Error fetching response from OpenAI:', error);
            typeMessage('[ERROR] Failed to get response from OpenAI.');
          });
        });
        commandInput.value = ""; // Clear input
      }
    }

    // Add event listener for form submission
    commandForm.addEventListener("submit", handleCommand);
});
