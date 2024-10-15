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