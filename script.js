const blob = document.getElementById("iblob");
const toggleSwitch = document.getElementById('mode-toggle');
const body = document.body;

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  
if (toggleSwitch) {
      toggleSwitch.checked = savedTheme === 'dark';
  }
});

toggleSwitch.onclick = (e) => {
  setTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');
}

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

function setTheme(theme) {
  if (theme === 'light') {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
  } else {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
  }
}