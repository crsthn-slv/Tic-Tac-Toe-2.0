class ConfettiAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.confettiPieces = [];
        this.animationId = null;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
        ];
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    removeCanvas() {
        if (this.canvas) {
            document.body.removeChild(this.canvas);
            this.canvas = null;
            this.ctx = null;
        }
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    createOConfetti(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 12,
            vy: Math.random() * -15 - 5,
            gravity: 0.4,
            life: 1,
            decay: Math.random() * 0.008 + 0.003,
            size: Math.random() * 6 + 3,
            color: this.getRandomColor(),
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            type: Math.random() > 0.5 ? 'circle' : 'oval',
            wobble: Math.random() * 0.02 + 0.01,
            wobbleOffset: Math.random() * Math.PI * 2,
            airResistance: 0.98
        };
    }

    createXConfetti(x, y) {
        const shapes = ['x', 'plus', 'cross'];
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 12,
            vy: Math.random() * -15 - 5,
            gravity: 0.4,
            life: 1,
            decay: Math.random() * 0.008 + 0.003,
            size: Math.random() * 6 + 3,
            color: this.getRandomColor(),
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 8,
            type: shapes[Math.floor(Math.random() * shapes.length)],
            wobble: Math.random() * 0.02 + 0.01,
            wobbleOffset: Math.random() * Math.PI * 2,
            airResistance: 0.98
        };
    }

    drawOConfetti(confetti) {
        this.ctx.save();
        this.ctx.globalAlpha = confetti.life * 0.9;
        this.ctx.fillStyle = confetti.color;
        this.ctx.translate(confetti.x, confetti.y);
        this.ctx.rotate(confetti.rotation * Math.PI / 180);

        // Add subtle shadow for depth
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        if (confetti.type === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, confetti.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else { // oval
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, confetti.size, confetti.size * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawXConfetti(confetti) {
        this.ctx.save();
        this.ctx.globalAlpha = confetti.life * 0.9;
        this.ctx.strokeStyle = confetti.color;
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.translate(confetti.x, confetti.y);
        this.ctx.rotate(confetti.rotation * Math.PI / 180);

        // Add subtle shadow for depth
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        const size = confetti.size;

        if (confetti.type === 'x') {
            // Draw X
            this.ctx.beginPath();
            this.ctx.moveTo(-size, -size);
            this.ctx.lineTo(size, size);
            this.ctx.moveTo(size, -size);
            this.ctx.lineTo(-size, size);
            this.ctx.stroke();
        } else if (confetti.type === 'plus') {
            // Draw +
            this.ctx.beginPath();
            this.ctx.moveTo(-size, 0);
            this.ctx.lineTo(size, 0);
            this.ctx.moveTo(0, -size);
            this.ctx.lineTo(0, size);
            this.ctx.stroke();
        } else { // cross
            // Draw tilted cross
            this.ctx.beginPath();
            this.ctx.moveTo(-size * 0.7, -size * 0.7);
            this.ctx.lineTo(size * 0.7, size * 0.7);
            this.ctx.moveTo(size * 0.7, -size * 0.7);
            this.ctx.lineTo(-size * 0.7, size * 0.7);
            this.ctx.moveTo(-size, 0);
            this.ctx.lineTo(size, 0);
            this.ctx.moveTo(0, -size);
            this.ctx.lineTo(0, size);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    updateConfetti() {
        for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
            const confetti = this.confettiPieces[i];
            
            // Update physics with air resistance and wobble
            confetti.vy += confetti.gravity;
            confetti.vx *= confetti.airResistance;
            confetti.vy *= confetti.airResistance;
            
            // Add wobble effect for more realistic movement
            confetti.wobbleOffset += confetti.wobble;
            const wobbleX = Math.sin(confetti.wobbleOffset) * 0.5;
            const wobbleY = Math.cos(confetti.wobbleOffset * 0.7) * 0.3;
            
            confetti.x += confetti.vx + wobbleX;
            confetti.y += confetti.vy + wobbleY;
            confetti.rotation += confetti.rotationSpeed;
            confetti.life -= confetti.decay;

            // Remove if off screen or faded
            if (confetti.life <= 0 || confetti.y > window.innerHeight + 100 || 
                confetti.x < -100 || confetti.x > window.innerWidth + 100) {
                this.confettiPieces.splice(i, 1);
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all confetti
        this.confettiPieces.forEach(confetti => {
            if (confetti.winner === 'O') {
                this.drawOConfetti(confetti);
            } else {
                this.drawXConfetti(confetti);
            }
        });

        this.updateConfetti();

        // Continue animation if there are still confetti pieces
        if (this.confettiPieces.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }

    launch(winner) {
        this.stop(); // Stop any existing animation
        this.createCanvas();
        
        // Get the position of the result text
        const resultTextElement = document.getElementById('result-text');
        let sourceX = window.innerWidth / 2;
        let sourceY = window.innerHeight / 2;
        
        if (resultTextElement) {
            const rect = resultTextElement.getBoundingClientRect();
            sourceX = rect.left + rect.width / 2;
            sourceY = rect.top + rect.height / 2;
        }
        
        // Create multiple bursts of confetti from text position
        for (let burst = 0; burst < 4; burst++) {
            setTimeout(() => {
                // Create confetti pieces for this burst
                for (let i = 0; i < 35; i++) {
                    const angle = (Math.random() * 140 - 70) * Math.PI / 180; // Spread in 140 degree arc
                    const velocity = Math.random() * 8 + 6;
                    const offsetX = Math.random() * 60 - 30; // Small initial spread
                    const offsetY = Math.random() * 20 - 10;
                    
                    let confetti;
                    if (winner === 'O') {
                        confetti = this.createOConfetti(sourceX + offsetX, sourceY + offsetY);
                    } else {
                        confetti = this.createXConfetti(sourceX + offsetX, sourceY + offsetY);
                    }
                    
                    // Set initial velocity based on angle for burst effect
                    confetti.vx = Math.sin(angle) * velocity * (1 + burst * 0.3);
                    confetti.vy = Math.cos(angle) * velocity * (1 + burst * 0.3) - 8;
                    confetti.winner = winner;
                    this.confettiPieces.push(confetti);
                }
                
                // Start animation on first burst
                if (burst === 0) {
                    this.animate();
                }
            }, burst * 200); // Faster burst intervals
        }

        // Auto-stop after 6 seconds
        setTimeout(() => {
            this.stop();
        }, 6000);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.confettiPieces = [];
        this.removeCanvas();
    }
}

// Create global confetti instance
window.confettiAnimation = new ConfettiAnimation();

// Convenience function to launch confetti
window.launchConfetti = function(winner) {
    window.confettiAnimation.launch(winner);
};