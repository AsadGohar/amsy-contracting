export function formDataToJson(formDataLog) {
  //   console.log(formDataLog);
  const jsonData = {
    items_pictures: [],
  };
  //   const itemsPictureRegex = /^items-picture-(\d+)/;
  const itemsPicturesRegex = /^items-pictures-\d+$/;

  formDataLog._parts.forEach(([key, value]) => {
    // Check if the key matches the items-picture regex
    const match = itemsPicturesRegex.test(key);
    if (match) {
      // Add the value to the items_pictures array
      // console.log('here');
      jsonData.items_pictures.push({ ...value, fieldname: key });
    } else {
      // Handle keys with array notation (e.g., items[0][name])
      const keyParts = key.split('[').map((part) => part.replace(']', ''));

      let currentLevel = jsonData;

      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];

        if (!currentLevel[part]) {
          // Check if the next part is a number (to handle arrays)
          if (isNaN(keyParts[i + 1])) {
            currentLevel[part] = {};
          } else {
            currentLevel[part] = [];
          }
        }

        currentLevel = currentLevel[part];
      }

      const lastPart = keyParts[keyParts.length - 1];

      // Set the value, converting quantity to a number if necessary
      if (lastPart === 'quantity') {
        currentLevel[lastPart] = Number(value);
      } else {
        currentLevel[lastPart] = value;
      }
    }
  });
  // console.log(jsonData.items_pictures);
  return jsonData;
}