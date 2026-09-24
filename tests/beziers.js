import seed from 'random-seed'

export default function drawSpaghetti({createCanvas, getBitmap}){
    let size = 512,
        canvas = createCanvas(size, size),
        ctx = canvas.getContext('2d'),
        count = 400,
        points = 10,
        rng = seed(process.env.SEED || 123),
        coord = () => rng.intBetween(0, size),
        colors = ["#59a14f", "#e15759", "#edc949", "#4e79a7", "#76b7b2", "black"]

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

        ctx.lineWidth = [0.5, 1.5, 2.5, 5, 10, 20][rng.intBetween(0,5)]
        ctx.strokeStyle = colors[rng.intBetween(0, colors.length-1)]
        ctx.globalAlpha = rng.floatBetween(0.1, 0.5)
        ctx.stroke()
    }

    return getBitmap(canvas)
}
