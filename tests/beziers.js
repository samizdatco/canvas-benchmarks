import seed from 'random-seed'

export default function drawSpaghetti({createCanvas, getBitmap}){
    let size = 1024,
        canvas = createCanvas(size, size),
        ctx = canvas.getContext('2d'),
        count = 150,
        points = 10,
        rng = seed(process.env.SEED || 123),
        coord = () => rng.intBetween(0, size)

    for (let ln=0; ln<count; ln++){
        ctx.beginPath()
        ctx.moveTo(coord(), coord())
        for (let p=0; p<points; p++){
            ctx.bezierCurveTo(
                coord(), coord(),
                coord(), coord(),
                coord(), coord(),
            )
        }

        ctx.lineWidth = [1, 3, 5, 10, 20, 40][rng.intBetween(0,5)]
        ctx.strokeStyle = ['white', 'black', 'skyblue'][rng.intBetween(0,2)]
        ctx.globalAlpha = rng.floatBetween(0.1, 0.5)
        ctx.stroke()
    }

    return getBitmap(canvas)
}