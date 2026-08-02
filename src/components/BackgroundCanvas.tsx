import React, { useRef, useEffect } from 'react';

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    
    // Star particles
    const starCount = isMobile ? 150 : 350;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.7 + 0.3,
      baseAlpha: Math.random() * 0.8 + 0.2,
      alpha: 0,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? '#FFC857' : (Math.random() > 0.5 ? '#C8A2FF' : '#FFFFFF')
    }));

    // Dust motes
    const dustCount = isMobile ? 20 : 50;
    const dusts = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: Math.random() * -0.5 - 0.1,
      alpha: Math.random() * 0.4 + 0.1
    }));

    // Shooting stars
    const shootingStars: any[] = [];
    let lastShootingStar = 0;

    // Flash stars (supernovae)
    const flashStars: any[] = [];
    
    // Nebulas
    const nebulas = [
      { x: width * 0.2, y: height * 0.3, radius: width * 0.4, color: 'rgba(157, 123, 255, 0.05)', vx: 0.1, vy: -0.05 },
      { x: width * 0.8, y: height * 0.7, radius: width * 0.5, color: 'rgba(255, 155, 207, 0.04)', vx: -0.08, vy: 0.06 },
      { x: width * 0.5, y: height * 0.5, radius: width * 0.6, color: 'rgba(16, 28, 69, 0.3)', vx: 0.05, vy: 0.05 }
    ];

    const drawNebulas = () => {
      nebulas.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -n.radius) n.x = width + n.radius;
        if (n.x > width + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = height + n.radius;
        if (n.y > height + n.radius) n.y = -n.radius;
        
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawStars = () => {
      stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;
        if (star.alpha < 0) star.alpha = 0;
        if (star.alpha > 1) star.alpha = 1;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.size > 2) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      ctx.globalAlpha = 1;
    };

    const drawDusts = () => {
      dusts.forEach(dust => {
        dust.x += dust.vx;
        dust.y += dust.vy;
        
        if (dust.y < -10) dust.y = height + 10;
        if (dust.x < -10) dust.x = width + 10;
        if (dust.x > width + 10) dust.x = -10;

        const grad = ctx.createRadialGradient(dust.x, dust.y, 0, dust.x, dust.y, dust.size);
        grad.addColorStop(0, `rgba(255, 210, 125, ${dust.alpha})`);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const handleShootingStars = (time: number) => {
      if (time - lastShootingStar > (Math.random() * 3000 + 3000)) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.3,
          length: Math.random() * 150 + 50,
          speed: Math.random() * 10 + 15,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          alpha: 1,
          thickness: Math.random() * 1.5 + 0.5
        });
        lastShootingStar = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.02;

        if (s.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const endX = s.x - Math.cos(s.angle) * s.length;
        const endY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        grad.addColorStop(0.2, `rgba(255, 210, 125, ${s.alpha * 0.8})`);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    };

    const handleFlashStars = () => {
      if (Math.random() < 0.005 && flashStars.length < 3) {
        flashStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0,
          maxSize: Math.random() * 3 + 4,
          life: 0,
          maxLife: 60
        });
      }

      for (let i = flashStars.length - 1; i >= 0; i--) {
        const f = flashStars[i];
        f.life++;
        
        let alpha = 1 - (Math.abs(f.life - f.maxLife/2) / (f.maxLife/2));
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#C8A2FF';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.maxSize * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (f.life >= f.maxLife) {
          flashStars.splice(i, 1);
        }
      }
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#070B1A');
      bgGrad.addColorStop(0.5, '#0C1633');
      bgGrad.addColorStop(1, '#101C45');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      drawNebulas();
      drawStars();
      drawDusts();
      handleFlashStars();
      handleShootingStars(time);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default BackgroundCanvas;
