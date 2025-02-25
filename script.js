const canvas = document.getElementById('galaxyCanvas');  
const ctx = canvas.getContext('2d');  

canvas.width = window.innerWidth;  
canvas.height = window.innerHeight;  

let particles = [];  
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };  
let currentPattern = 0;  
const patterns = [  
    {  
        background: 'radial-gradient(circle, #0f0527, #030014)', // Deep space gradient  
        particleColor: (life) => `rgba(191, 64, 191, ${life / 150})`, // Neon Purple  
        particleShape: 'star',  
        particleSpeed: 0.8,  
        particleSize: 10  
    },  
    {  
        background: 'linear-gradient(45deg, #1a1a3a, #ff6b6b)', // Purple to Pink gradient  
        particleColor: (life) => `rgba(255, 107, 107, ${life / 150})`, // Fiery Pink  
        particleShape: 'circle',  
        particleSpeed: 0.5,  
        particleSize: 8  
    },  
    {  
        background: 'radial-gradient(circle, #002b5b, #00ffcc)', // Dark Blue to Cyan gradient  
        particleColor: (life) => `rgba(0, 255, 204, ${life / 150})`, // Electric Cyan  
        particleShape: 'spiral',  
        particleSpeed: 0.7,  
        particleSize: 12  
    },  
    {  
        background: 'linear-gradient(135deg, #4a00e0, #ff00ff)', // Purple to Magenta gradient  
        particleColor: (life) => `rgba(255, 0, 255, ${life / 150})`, // Neon Magenta  
        particleShape: 'star',  
        particleSpeed: 0.6,  
        particleSize: 7  
    }  
];  

class Particle {  
    constructor(x, y, pattern) {  
        this.x = x;  
        this.y = y;  
        this.size = Math.random() * pattern.particleSize + 2;  
        this.angle = Math.random() * Math.PI * 2;  
        this.speed = Math.random() * pattern.particleSpeed + 0.3;  
        this.distance = Math.random() * 150 + 100;  
        this.rotation = 0;  
        this.rotationSpeed = Math.random() * 0.05 + 0.01;  
        this.life = 150;  
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
        ctx.fill();  
    }  

    drawCircle(cx, cy) {  
        ctx.beginPath();  
        ctx.arc(cx, cy, this.size, 0, Math.PI * 2);  
        ctx.fillStyle = this.getColor();  
        ctx.fill();  
        ctx.closePath();  
    }  

    drawSpiral(cx, cy) {  
        ctx.beginPath();  
        const spiralRadius = this.size * (1 - this.life / 150);  
        ctx.moveTo(cx, cy);  
        for (let i = 0; i < 5; i++) {  
            const angle = i * Math.PI / 2 + this.angle;  
            const r = spiralRadius * i / 5;  
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);  
        }  
        ctx.strokeStyle = this.getColor();  
        ctx.lineWidth = 2;  
        ctx.stroke();  
        ctx.closePath();  
    }  

    update() {  
        const dx = mouse.x - this.x;  
        const dy = mouse.y - this.y;  
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);  

        if (distanceToMouse < this.distance) {  
            const angleToMouse = Math.atan2(dy, dx);  
            this.x += Math.cos(angleToMouse) * this.speed;  
            this.y += Math.sin(angleToMouse) * this.speed;  
        } else {  
            this.angle += this.speed * 0.05;  
            this.x += Math.cos(this.angle) * this.speed * 1.5;  
            this.y += Math.sin(this.angle) * this.speed * 1.5;  
        }  

        this.rotation += this.rotationSpeed;  
        this.life--;  
        this.size *= 0.99;  
    }  

    draw() {  
        ctx.save();  
        ctx.translate(this.x, this.y);  
        ctx.rotate(this.rotation);  

        if (this.pattern.particleShape === 'star') {  
            this.drawStar(0, 0, 5, this.size, this.size * 0.4);  
        } else if (this.pattern.particleShape === 'circle') {  
            this.drawCircle(0, 0);  
        } else if (this.pattern.particleShape === 'spiral') {  
            this.drawSpiral(0, 0);  
        }  

        ctx.restore();  
    }  
}  

window.addEventListener('mousemove', (e) => {  
    mouse.x = e.clientX;  
    mouse.y = e.clientY;  
    for (let i = 0; i < 3; i++) {  
        particles.push(new Particle(mouse.x, mouse.y, patterns[currentPattern]));  
    }  
});  

function changePattern() {  
    currentPattern = (currentPattern + 1) % patterns.length;  
    document.body.style.background = patterns[currentPattern].background;  
    setTimeout(changePattern, 5000); // Change pattern every 5 seconds  
}  

function animate() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    particles = particles.filter(p => p.life > 0);  
    particles.forEach(particle => {  
        particle.update();  
        particle.draw();  
    });  
    requestAnimationFrame(animate);  
}  

animate();  
changePattern(); // Start the pattern change cycle  

window.addEventListener('resize', () => {  
    canvas.width = window.innerWidth;  
    canvas.height = window.innerHeight;  
});  