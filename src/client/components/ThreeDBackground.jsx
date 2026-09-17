import React, { useEffect, useRef } from 'react';
import './ThreeDBackground.css';

const ThreeDBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles setup
    const particleCount = 85;
    const particles = [];

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize 3D particles with Z-depth
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * width,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#06B6D4' : '#A855F7',
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 1.5,
      });
    }

    const focalLength = 400;

    const render = () => {
      ctx.fillStyle = 'rgba(11, 15, 25, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + (mouseX - width / 2) * 0.05;
      const cy = height / 2 + (mouseY - height / 2) * 0.05;

      // Draw grid wave lines in 3D
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;

      const time = Date.now() * 0.001;
      const gridCols = 16;
      const gridRows = 16;
      const spacing = 100;

      for (let i = -gridCols / 2; i < gridCols / 2; i++) {
        for (let j = -gridRows / 2; j < gridRows / 2; j++) {
          const x = i * spacing;
          const z = j * spacing + ((time * 40) % spacing);
          const y = Math.sin(time * 2 + (x * 0.005) + (z * 0.005)) * 30 + 150;

          const scale = focalLength / (focalLength + z + 500);
          const px = cx + x * scale;
          const py = cy + y * scale;

          if (j === -gridRows / 2) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();

      // Draw 3D Floating Nodes & Connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around bounds
        if (p.z <= -focalLength) p.z = width;
        if (p.z > width) p.z = -focalLength + 10;

        const scale = focalLength / (focalLength + p.z);
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;
        const pRadius = Math.max(0.5, p.radius * scale * 1.5);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          // Draw Particle Node
          ctx.beginPath();
          ctx.arc(px, py, pRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = pRadius * 4;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = Math.min(1, scale * 1.2);
          ctx.fill();

          // Connect nearby particles in 3D space
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dz = p.z - p2.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 180) {
              const scale2 = focalLength / (focalLength + p2.z);
              const p2x = cx + p2.x * scale2;
              const p2y = cy + p2.y * scale2;

              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(p2x, p2y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / 180) * 0.25 * scale;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="three-d-canvas-bg" />;
};

export default ThreeDBackground;
