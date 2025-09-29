// translate.js

const globeIcon = document.querySelector(".globe-icon");
const langDropdown = document.querySelector(".lang-dropdown");
const langItems = document.querySelectorAll(".lang-menu li");

// Toggle dropdown
globeIcon.addEventListener("click", () => {
  langDropdown.classList.toggle("active");
});

// Translate function using Free Translate API
async function translateText(text, targetLang) {
  try {
    const res = await fetch("https://ftapi.pythonanywhere.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, target: targetLang })
    });
    if (!res.ok) throw new Error("Translation API error");
    const data = await res.json();
    return data.translated_text || text;
  } catch (err) {
    console.error(err);
    return text; // fallback
  }
}

// Update all elements with data-translate or data-placeholder
async function updateLanguage(lang) {
  // Save selected language
  localStorage.setItem("selectedLanguage", lang);

  // Translate all text elements
  const elements = document.querySelectorAll("[data-translate]");
  for (let el of elements) {
    const original = el.getAttribute("data-translate");
    el.textContent = await translateText(original, lang);
  }

  // Translate input placeholders
  const inputs = document.querySelectorAll("[data-placeholder]");
  for (let input of inputs) {
    const original = input.getAttribute("data-placeholder");
    input.placeholder = await translateText(original, lang);
  }

  // Translate prediction results (if any)
  const resultDiv = document.getElementById("result");
  if (resultDiv.innerHTML) {
    const original = resultDiv.getAttribute("data-original") || resultDiv.innerHTML;
    const translated = await translateText(original, lang);
    resultDiv.innerHTML = translated;
    resultDiv.setAttribute("data-original", original);
  }
}

// Handle language selection
langItems.forEach(item => {
  item.addEventListener("click", async () => {
    const lang = item.getAttribute("data-lang");
    await updateLanguage(lang);
    langDropdown.classList.remove("active");
  });
});

// Load previously selected language
window.addEventListener("DOMContentLoaded", async () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "en";
  await updateLanguage(savedLang);
});

// Optional: you can call updateLanguage again after prediction to translate results dynamically
