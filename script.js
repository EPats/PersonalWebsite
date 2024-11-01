const blob = document.getElementById("iblob");

window.onmousemove = (e) => {
  
  const { clientX, clientY } = event
  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
    }, { duration: 2100, fill: "forwards" });
  
  for (const card of document.getElementsByTagName("figure")) {
    
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
  
};

// Get the elements
const toggleSwitch = document.getElementById('mode-toggle');
console.log(toggleSwitch);
const body = document.body;

// Toggle between light and dark mode
toggleSwitch.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  body.classList.toggle('dark-mode');
});