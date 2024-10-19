const canvas = document.getElementById('lorenzCanvas');
    const context = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 130;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let [x, y, z] = [0.01, 0, 0];
    let [sigma, rho, beta] = [10, 28, 8/3];

    const points = [];
    let criticalPoints = [];
    let [rotationX, rotationY, rotationZ] = [0, 0, 0];
    let [mouseX, mouseY] = [0, 0];
    let hue = 0;

    ['sigma', 'rho', 'beta'].forEach((param, i) => {
        const slider = document.getElementById(`${param}Slider`);
        slider.onchange = () => {
            [sigma, rho, beta][i] = parseFloat(slider.value);
            updateCriticalPoints;
        }
    });

    function updateCriticalPoints() {
        rho_minus1 = rho - 1
        discriminant = Math.sqrt(beta * rho_minus1)
      criticalPoints = [
        { x: discriminant, y: discriminant, z: rho - 1 },
        { x: -discriminant, y: -discriminant, z: rho - 1 },
        { x: 0, y: 0, z: 0 }
      ];
    }

    function rotatePoint(point) {
        const [cosX, sinX] = [Math.cos(rotationX), Math.sin(rotationX)];
        const [cosY, sinY] = [Math.cos(rotationY), Math.sin(rotationY)];
        const [cosZ, sinZ] = [Math.cos(rotationZ), Math.sin(rotationZ)];
  
        const rotatedX = point.x * (cosY * cosZ) + point.y * (cosY * sinZ) - point.z * sinY;
        const rotatedY = point.x * (cosZ * sinX * sinY - cosX * sinZ) + point.y * (cosX * cosZ + sinX * sinY * sinZ) + point.z * (cosY * sinX);
        const rotatedZ = point.x * (cosX * cosZ * sinY + sinX * sinZ) + point.y * (cosX * sinY * sinZ - cosZ * sinX) + point.z * (cosX * cosY);
  
        return { x: rotatedX, y: rotatedY, z: rotatedZ };
    }

    function drawCriticalPoints() {
        context.fillStyle = 'white';
        for (const point of criticalPoints) {
            const rotatedPoint = rotatePoint(point);
            const px = rotatedPoint.x * 5;
            const py = rotatedPoint.y * 5;
            context.beginPath();
            context.arc(px, py, 3, 0, Math.PI * 2);
            context.fill();
        }
    }

    function drawTrail() {
        const trailLength = points.length;
        points.forEach((point, i) => {
            if (i === 0) return;
            const { x: x1, y: y1 } = rotatePoint(points[i - 1]);
            const { x: x2, y: y2 } = rotatePoint(point);
            const opacity = 1 - Math.pow((trailLength - i) / trailLength, 4);
            context.strokeStyle = `hsla(${hue}, 100%, 50%, ${opacity})`;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(x1 * 5, y1 * 5);
            context.lineTo(x2 * 5, y2 * 5);
            context.stroke();
        });
        hue = (hue + 0.01) % 360;
    }

    function drawDot(point) {
        const rotatedPoint = rotatePoint(point);
        const px = rotatedPoint.x * 5;
        const py = rotatedPoint.y * 5;
  
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
        
        context.strokeStyle = 'red';
        drawAxis(axisLength, 0, 0); // x-axis

        context.strokeStyle = 'green';
        drawAxis(0, -axisLength, 0); // y-axis (inverted)

        context.strokeStyle = 'blue';
        drawAxis(0, 0, axisLength); // z-axis
    }

    function drawAxis(x, y, z) {
        const startPoint = rotatePoint({ x: 0, y: 0, z: 0 });
        const endPoint = rotatePoint({ x, y, z });

        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
    }

    canvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
   

    function animate() {
      const dt = 0.01;
      const dx = (sigma * (y - x)) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;

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
      rotationX = -(mouseY / canvas.height - 0.5) * Math.PI;
      rotationY = -(mouseX / canvas.width - 0.5) * Math.PI;

      drawAxes();
      drawCriticalPoints();
      drawTrail();
      drawDot(points[points.length - 1]);

      context.restore();

      requestAnimationFrame(animate);
    }

    const restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', () => {
      x = 0.01;
      y = 0;
      z = 0;
      points.length = 0;
      updateCriticalPoints();
    });

    updateCriticalPoints();
    animate();