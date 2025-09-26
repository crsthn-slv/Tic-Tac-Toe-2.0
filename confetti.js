class ConfettiAnimation {
    constructor() {
        this.confettiContainer = null;
        this.confettiPieces = [];
        this.animationId = null;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
        ];
    }

    createContainer() {
        this.confettiContainer = document.createElement('div');
        this.confettiContainer.style.position = 'fixed';
        this.confettiContainer.style.top = '0';
        this.confettiContainer.style.left = '0';
        this.confettiContainer.style.width = '100%';
        this.confettiContainer.style.height = '100%';
        this.confettiContainer.style.pointerEvents = 'none';
        this.confettiContainer.style.zIndex = '9999';
        this.confettiContainer.style.overflow = 'hidden';
        
        document.body.appendChild(this.confettiContainer);
    }

    removeContainer() {
        if (this.confettiContainer) {
            document.body.removeChild(this.confettiContainer);
            this.confettiContainer = null;
        }
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    createOConfetti(x, y) {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.pointerEvents = 'none';
        
        const confetti = {
            element: element,
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
        
        this.styleOConfetti(confetti);
        this.confettiContainer.appendChild(element);
        return confetti;
    }

    createXConfetti(x, y) {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.pointerEvents = 'none';
        
        const shapes = ['x', 'plus', 'cross'];
        const confetti = {
            element: element,
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
        
        this.styleXConfetti(confetti);
        this.confettiContainer.appendChild(element);
        return confetti;
    }

    styleOConfetti(confetti) {
        const element = confetti.element;
        element.style.width = confetti.size * 2 + 'px';
        element.style.height = confetti.size * 2 + 'px';
        element.style.backgroundColor = confetti.color;
        element.style.boxShadow = '1px 1px 3px rgba(0,0,0,0.3)';
        
        if (confetti.type === 'circle') {
            element.style.borderRadius = '50%';
        } else { // oval
            element.style.borderRadius = '50%';
            element.style.transform = 'scaleY(0.6)';
        }
        
        this.updateConfettiPosition(confetti);
    }

    styleXConfetti(confetti) {
        const element = confetti.element;
        const size = confetti.size;
        element.style.width = size * 2 + 'px';
        element.style.height = size * 2 + 'px';
        element.style.fontSize = size + 'px';
        element.style.fontWeight = 'bold';
        element.style.color = confetti.color;
        element.style.textAlign = 'center';
        element.style.lineHeight = size * 2 + 'px';
        element.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
        
        if (confetti.type === 'x') {
            element.textContent = '✕';
        } else if (confetti.type === 'plus') {
            element.textContent = '+';
        } else { // cross
            element.textContent = '✚';
        }
        
        this.updateConfettiPosition(confetti);
    }

    updateConfettiPosition(confetti) {
        const element = confetti.element;
        element.style.left = confetti.x + 'px';
        element.style.top = confetti.y + 'px';
        element.style.opacity = confetti.life * 0.9;
        element.style.transform = `rotate(${confetti.rotation}deg) ${confetti.type === 'oval' ? 'scaleY(0.6)' : ''}`;
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
            
            // Update DOM position and style
            this.updateConfettiPosition(confetti);

            // Remove if off screen or faded
            if (confetti.life <= 0 || confetti.y > window.innerHeight + 100 || 
                confetti.x < -100 || confetti.x > window.innerWidth + 100) {
                if (confetti.element && confetti.element.parentNode) {
                    confetti.element.parentNode.removeChild(confetti.element);
                }
                this.confettiPieces.splice(i, 1);
            }
        }
    }

    animate() {
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
        this.createContainer();
        
        // Get the position of the victory title (or fallback to result text)
        let resultTextElement = document.getElementById('victory-title');
        if (!resultTextElement) {
            resultTextElement = document.getElementById('result-text');
        }
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
        // Clean up all confetti elements
        this.confettiPieces.forEach(confetti => {
            if (confetti.element && confetti.element.parentNode) {
                confetti.element.parentNode.removeChild(confetti.element);
            }
        });
        this.confettiPieces = [];
        this.removeContainer();
    }
}

// Create global confetti instance
window.confettiAnimation = new ConfettiAnimation();

// Convenience function to launch confetti
window.launchConfetti = function(winner) {
    window.confettiAnimation.launch(winner);
};