const paper = document.querySelector('.paper');
const pen = paper.getContext('2d');

const startTime = Date.now();

paper.width = paper.clientWidth;
paper.height = paper.clientHeight;

const start = {
    x: paper.width * 0.3,
    y: paper.height * 0.5
};

const end = {
    x: paper.width * 0.7,
    y: paper.height * 0.5
};

const center = {
    x: paper.width / 2,
    y: paper.height * 0.5
};

const length = end.x - start.x;

class Bob {
    constructor(radius, center, numberOfRotations) {
        this.center = center;
        this.radius = radius;
        this.velocity = (Math.PI * 2 * numberOfRotations) / 900;
        
        this.currentImpactTime = 0;
        this.nextImpactTime = this.calculateNextImpactTime();
        this.timeToImpact = this.nextImpactTime;
        this.timeSinceImpact = 0;
    }

    draw(pen, timeElapsed) {
        this.drawArc(pen);

        this.drawBob(pen, timeElapsed);
    }
    
    update(timeElapsed) {        
        if (timeElapsed > this.nextImpactTime) {
            this.currentImpactTime = this.nextImpactTime;
            this.nextImpactTime = this.calculateNextImpactTime();
        }
        
        this.timeSinceImpact = timeElapsed - this.currentImpactTime;
        this.timeToImpact = this.nextImpactTime - timeElapsed;
    }

    drawArc(pen) {
        pen.beginPath();
        if (this.timeSinceImpact < 0.5) {
            pen.strokeStyle = "rgb(25, 180, 85)";

            if (this.timeSinceImpact > 0.25) {
                pen.strokeStyle = this.getArcColor((this.timeSinceImpact - 0.25) / 0.25);
            }
        } else {
            pen.strokeStyle = "rgb(70, 100, 75)";
        }
        pen.arc(
            this.center.x,
            this.center.y,
            this.radius,
            0,
            Math.PI * 2
        );
        pen.stroke();
    }

    getArcColor(percent) {
        const red = (percent * 70 + (1 - percent) * 25)
        const green = (percent * 100 + (1 - percent) * 180)
        const blue = (percent * 75 + (1 - percent) * 85)

        return `rgb(${red}, ${green}, ${blue})`;
    }

    drawBob(pen, timeElapsed) {
        let totalDistance = (this.velocity * timeElapsed) % (Math.PI * 2);

        const x = -this.radius * Math.cos(totalDistance) + this.center.x;
        const y = -this.radius * Math.sin(totalDistance) + this.center.y;

        pen.fillStyle = "rgb(50, 131, 168)";

        pen.beginPath();
        pen.arc(x, y, length * 0.005, 0, Math.PI * 2);
        pen.fill();
    }
    
    calculateNextImpactTime() {
        return this.currentImpactTime + (Math.PI / this.velocity);
    }
}

// initialise bobs
const bobs = [];
const number = 21; // number of arcs and bobs

initialArcRadius = length * 0.075;
radiusDifference = (length / 2 - initialArcRadius) / number;

for (let i = 0; i < number; i++) {
    bobs.push(new Bob(radiusDifference * i + initialArcRadius, center, 50 - i));
}

const draw = () => {
    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    pen.strokeStyle = 'rgb(70, 100, 75)';
    pen.lineWidth = 2;

    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();
    const timeElapsed = (Date.now() - startTime) / 1000;

    for (const bob of bobs) {
        bob.update(timeElapsed);
        bob.draw(pen, timeElapsed);
    }

    requestAnimationFrame(draw);
};

draw();
