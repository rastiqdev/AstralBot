const Canvas = require("canvas");

module.exports = getCaptcha = function() {
    Canvas.registerFont(__dirname + "../../../res/fonts/Roboto.ttf", { family: 'Roboto' });
    Canvas.registerFont(__dirname + '../../../res/fonts/sans.ttf', { family: 'Sans' });

    let i;
    const canvas = Canvas.createCanvas(400, 180);
    const ctx = canvas.getContext('2d');
    const num = 5;
    const cords = [];
    const colors = ['blue', 'red', 'green', 'yellow', 'black', 'white'];
    let string = '';
    const particles = Math.floor(Math.random() * 101);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    // Random code generation
    for (i = 0; i < 5; i++) {
        string += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    ctx.font = 'bold 100px Roboto';
    ctx.lineWidth = 7.5;
    let textPos = 45;
    // Captcha text
    for (i = 0; i < string.length; i++) {
        const char = string.charAt(i);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(char, textPos, 120);
        textPos += 65;
    }
    // Particles
    for (i = 0; i < particles; i++) {
        const pos = {
            width: Math.floor(Math.random() * canvas.width),
            height: Math.floor(Math.random() * canvas.height)
        };
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(pos.width, pos.height, 3.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    // Get the cords
    let x = 0;
    for (i = 0; i < num + 1; i++) {
        const l = Math.floor(Math.random() * canvas.height);
        if (i !== 0) x += canvas.width / num;
        cords.push([x, l]);
    }
    // Strokes
    for (i = 0; i < cords.length; i++) {
        const cord = cords[i];
        const nextCord = cords[i + 1];
        ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.moveTo(cord[0], cord[1]);
        if (nextCord) ctx.lineTo(nextCord[0], nextCord[1]);
        ctx.stroke();
    }
    return { buffer: canvas.toBuffer(), text: string };
};