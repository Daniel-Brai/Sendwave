const jsonString = document.getElementById('recipient_emails').value;

const decodedJSONString = jsonString.replace(/&quot;/g, '"');

try {
  const parsedData = JSON.parse(decodedJSONString);
  console.log(parsedData);
} catch (error) {
  console.error("Error parsing JSON:", error);
}
