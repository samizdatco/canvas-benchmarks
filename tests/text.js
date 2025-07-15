import seed from 'random-seed'

export default function drawText({createCanvas, getBitmap}){
    let canvas = createCanvas(1024, 768),
        ctx = canvas.getContext('2d'),
        count = 140,
        rng = seed(process.env.SEED || 123)

    for (let i=0; i<count; i++){
        let x = rng.intBetween(0, 400),
            y = rng.intBetween(0, 400),
            weight = rng.intBetween(1,9) * 100,
            size = rng.intBetween(8, 200),
            char = String.fromCharCode(rng.intBetween(33, 93)),
            color = rng.intBetween(0, 255).toString(16)
        ctx.fillStyle = '#'+color+color+color
        ctx.font = `${weight} ${size}px Arial`
        ctx.fillText(char, x, y)
    }

    return getBitmap(canvas)
}
