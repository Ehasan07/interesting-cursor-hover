const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let currentPattern = 0;
const patterns = [
    {
        background: 'radial-gradient(circle, #00251a, #00cc66, #66ff99)', // Dark teal to vibrant green
        particleColor: (life) => `hsla(${120 + life / 5}, 90%, 70%, ${life / 180})`, // Rich green glow
        particleShape: 'star',
        particleSpeed: 0.5,
        particleSize: 14
    },
    {
        background: 'radial-gradient(circle, #1a0033, #0d001a, #000)', // Cosmic purple-black
        particleColor: (life) => `hsla(${200 + life / 5}, 80%, 70%, ${life / 180})`, // Blue-purple glow
        particleShape: 'star',
        particleSpeed: 0.6,
        particleSize: 10
    },
    {
        background: 'radial-gradient(circle, #332600, #ffcc00, #ffff66)', // Dark gold to bright yellow
        particleColor: (life) => `hsla(${60 + life / 5}, 90%, 70%, ${life / 180})`, // Vibrant yellow glow
        particleShape: 'star',
        particleSpeed: 0.5,
        particleSize: 12
    },
    {
        background: 'linear-gradient(135deg, #330000, #ff3333, #ff6666)', // Deep red to bright red
        particleColor: (life) => `hsla(${0 + life / 5}, 90%, 60%, ${life / 180})`, // Vibrant red glow
        particleShape: 'flame',
        particleSpeed: 0.7,
        particleSize: 11
    },
    {
        background: 'radial-gradient(circle, #2d0040, #6600cc, #cc00ff)', // Deep violet to neon purple
        particleColor: (life) => `hsla(${270 + life / 5}, 90%, 60%, ${life / 180})`, // Vibrant purple
        particleShape: 'flower',
        particleSpeed: 0.4,
        particleSize: 11
    },
    {
        background: 'linear-gradient(45deg, #1a237e, #3f51b5, #ff8f00)', // Deep blue to indigo to orange
        particleColor: (life) => `hsla(${240 + life / 5}, 80%, 60%, ${life / 180})`, // Blue-orange blend
        particleShape: 'burst',
        particleSpeed: 0.6,
        particleSize: 9
    }
];

class Particle {
    constructor(x, y, pattern) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * pattern.particleSize + 3;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * pattern.particleSpeed + 0.2;
        this.distance = Math.random() * 180 + 120;
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.03 + 0.01;
        this.life = 180;
        this.pattern = pattern;
    }

    getColor() {
        return this.pattern.particleColor(this.life);
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = this.getColor();
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.getColor();
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    drawFlame(cx, cy) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + this.size);
        ctx.quadraticCurveTo(cx - this.size * 0.5, cy, cx, cy - this.size * 1.2);
        ctx.quadraticCurveTo(cx + this.size * 0.5, cy, cx, cy + this.size);
        ctx.closePath();
        ctx.fillStyle = this.getColor();
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.getColor();
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    drawFlower(cx, cy) {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i + this.angle;
            const r = this.size * (1 + Math.sin(angle * 4)) * 0.5;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = this.getColor();
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.getColor();
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    drawBurst(cx, cy) {
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI / 6) * i + this.angle;
            const r = this.size * (i % 2 === 0 ? 1 : 0.5);
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.getColor();
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < this.distance) {
            const angleToMouse = Math.atan2(dy, dx);
            this.x += Math.cos(angleToMouse) * this.speed * 0.8;
            this.y += Math.sin(angleToMouse) * this.speed * 0.8;
        } else {
            this.angle += this.speed * 0.03;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        }

        this.rotation += this.rotationSpeed;
        this.life--;
        this.size *= 0.995;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.pattern.particleShape === 'star') {
            this.drawStar(0, 0, 5, this.size, this.size * 0.4);
        } else if (this.pattern.particleShape === 'flame') {
            this.drawFlame(0, 0);
        } else if (this.pattern.particleShape === 'flower') {
            this.drawFlower(0, 0);
        } else if (this.pattern.particleShape === 'burst') {
            this.drawBurst(0, 0);
        }

        ctx.restore();
    }
}

// Mouse interaction
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y, patterns[currentPattern]));
    }
});

// Touch interaction for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y, patterns[currentPattern]));
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    for (let i = 0; i < 1; i++) {
        particles.push(new Particle(mouse.x, mouse.y, patterns[currentPattern]));
    }
});

function changePattern() {
    currentPattern = (currentPattern + 1) % patterns.length;
    document.body.style.background = patterns[currentPattern].background;
    setTimeout(changePattern, 6000);
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (particles.length > 100) {
        particles = particles.slice(-100);
    }
    
    particles = particles.filter(p => p.life > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

animate();
changePattern();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});