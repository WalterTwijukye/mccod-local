// Define a function to import JSON data into IndexedDB
function importJsonData(jsonData) {
    return new Promise((resolve, reject) => {
      // Open or create a database
      const request = indexedDB.open('MedicalCertificateOfCauseOfDeath', 1);
  
      request.onerror = (event) => {
        reject('Error opening database: ' + event.target.errorCode);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
  
        // Create an object store
        const objectStore = db.createObjectStore('data', { keyPath: 'id', autoIncrement: true });
  
        // Define the structure of the data
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('age', 'age', { unique: false });
        // Add other indexes as needed
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
  
        // Add data to the object store
        const transaction = db.transaction(['data'], 'readwrite');
        const objectStore = transaction.objectStore('data');
  
        // Iterate over the JSON data and add each object to the object store
        jsonData.forEach((item) => {
          const addRequest = objectStore.add(item);
  
          addRequest.onerror = (event) => {
            reject('Error adding data: ' + event.target.error);
          };
        });
  
        transaction.oncomplete = () => {
          resolve('JSON data imported successfully');
        };
  
        transaction.onerror = (event) => {
          reject('Transaction error: ' + event.target.error);
        };
      };
    });
  }
  
  // Example usage: Read JSON file and import data into IndexedDB
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);
        importJsonData(jsonData)
          .then((message) => {
            console.log(message);
            // Provide feedback to the user if needed
          })
          .catch((error) => {
            console.error(error);
            // Handle error and provide feedback to the user
          });
      };
      reader.onerror = function(error) {
        console.error('File reading error:', error);
        // Handle error and provide feedback to the user
      };
      reader.readAsText(file);
    }
  });
  