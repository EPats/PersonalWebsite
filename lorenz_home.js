const canvas = document.getElementById('lorenzCanvas');
    const context = canvas.getContext('2d');
    const parameters = {
      sigma: 10,
      rho: 28,
      beta: 8 / 3
    };

    let scaleFactor = window.innerWidth / 100;
    let xOffset = 0;

    let [x, y, z] = [0.01, 0, 0];
 

    const points = [];
    let criticalPoints = [];
    let [rotationX, rotationY] = [Math.PI / 10, Math.PI / 4];
    let [mouseX, mouseY] = [window.innerWidth / 2, window.innerHeight / 2];
    let hue = 15;
    let hueDirection = 1;

    function canvasToWindowCoordinates(canvasX, canvasY) {
      // Get the canvas's position relative to the viewport
      const rect = canvas.getBoundingClientRect();
      
      // Calculate the scale factor between canvas coordinates and display coordinates
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // Convert to window coordinates
      const windowX = (canvasX / scaleX) + rect.left + window.scrollX;
      const windowY = (canvasY / scaleY) + rect.top + window.scrollY;
      
      return {
          x: windowX,
          y: windowY
      };
  }  

  function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        scaleFactor = Math.min(window.innerWidth / 100, window.innerHeight / 60);
        xOffset = 20 * scaleFactor;
  }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function rotatePointRaw(point) {
      const [cosX, sinX] = [Math.cos(Math.PI / 10), Math.sin(Math.PI / 10)];
      const [cosY, sinY] = [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)];

      const rotatedX = point.x * cosY - point.z * sinY;
      const rotatedY = point.x * sinX * sinY + point.y * cosX + point.z * (cosY * sinX);

      return { x: rotatedX, y: rotatedY};
    }


    function rotatePoint(point) {
        const [cosX, sinX] = [Math.cos(rotationX), Math.sin(rotationX)];
        const [cosY, sinY] = [Math.cos(rotationY), Math.sin(rotationY)];
  
        const rotatedX = point.x * cosY - point.z * sinY;
        const rotatedY = point.x * sinX * sinY + point.y * cosX + point.z * (cosY * sinX);
  
        return { x: rotatedX, y: rotatedY};
    }

    function drawTrail() {
        const trailLength = points.length;
        points.forEach((point, i) => {
            if (i === 0) return;
            const { x: x1, y: y1 } = rotatePoint(points[i - 1]);
            const { x: x2, y: y2 } = rotatePoint(point);
            const opacity = 1 - Math.pow((trailLength - i) / trailLength, 4);
            context.strokeStyle = `hsla(${hue}, 90%, 55%, ${opacity})`;
            context.lineWidth = 1 + opacity*4;
            context.beginPath();
            context.moveTo(x1 * scaleFactor + xOffset, y1 * scaleFactor);
            context.lineTo(x2 * scaleFactor + xOffset, y2 * scaleFactor);
            context.stroke();
        });
        hue += 0.1 * hueDirection;
        
        if (hue >= 60) {
            hueDirection = -1;
        } else if (hue <= 20) {
            hueDirection = 1;
        }

    }

    function drawDot(point) {
        const rotatedPoint = rotatePoint(point);
        const px = rotatedPoint.x * scaleFactor + xOffset;
        const py = rotatedPoint.y * scaleFactor;
  
        if (isFinite(px) && isFinite(py)) {
          const gradient = context.createRadialGradient(px, py, 0, px, py, 10);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(px, py, 10, 0, Math.PI * 2);
          context.fill();
        }
      }

    function drawAxes() {
        const axisLength = 100;
        
        context.strokeStyle = '#FFFFFF';
        drawAxis(axisLength, 0, 0); // x-axis

        context.strokeStyle = '#BBBBBB';
        drawAxis(0, -axisLength, 0); // y-axis (inverted)

        context.strokeStyle = '#888888';
        drawAxis(0, 0, axisLength); // z-axis
    }

    function updateCriticalPoints() {
      rho_minus1 = parameters['rho'] - 1
      discriminant = Math.sqrt(parameters['beta'] * rho_minus1)
      criticalPoints = [
        { x: discriminant, y: discriminant, z: rho_minus1 },
        { x: -discriminant, y: -discriminant, z: rho_minus1 },
        { x: 0, y: 0, z: 0 }
      ];
    }

    function drawAxis(x, y, z) {
        const startPoint = rotatePoint({ x: 0, y: 0, z: 0 });
        const endPoint = rotatePoint({ x, y, z });

        context.beginPath();
        context.moveTo(startPoint.x + xOffset, startPoint.y);
        context.lineTo(endPoint.x + xOffset, endPoint.y);
        context.stroke();
    }

    window.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
   
    function animate() {
      const dt = 0.008;
      const dx = (parameters['sigma'] * (y - x)) * dt;
      const dy = (x * (parameters['rho'] - z) - y) * dt;
      const dz = (x * y - parameters['beta'] * z) * dt;

      x += dx;
      y += dy;
      z += dz;

      points.push({x, y, z});

      if (points.length > 500) {
        points.shift();
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(canvas.width/2, canvas.height/2);

      // Update rotation based on mouse position
      const dRotationX = (mouseY / window.innerHeight - 0.5) * Math.PI;
      const dRotationY = (mouseX / window.innerWidth - 0.5) * Math.PI;
      rotationX = Math.PI / 10 + dRotationX * 0.15
      rotationY = Math.PI / 4 + dRotationY * 0.15


      drawAxes();
      drawTrail();
      drawDot(points[points.length - 1]);

      context.restore();

      requestAnimationFrame(animate);
    }

    animate();
