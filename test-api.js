const API_KEY = "AIzaSyB_SB-pAwmv7q_oMBv7flxkydtoMhDUDuk";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Hello" }] }],
  })
})
  .then(res => res.json())
  .then(data => console.log("Response:", JSON.stringify(data)))
  .catch(err => console.error("Error:", err));
