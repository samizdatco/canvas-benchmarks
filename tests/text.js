import {fileURLToPath} from 'url'
import seed from 'random-seed'

// use manually-loaded fonts so canvaskit-wasm (which has no access to system fonts) can render correctly
const FONT_FAMILY = 'Raleway'
const FONT_FACES = {100:'Thin', 200:'ExtraLight', 300:'Light', 400:'Regular', 500:'Medium',
                    600:'SemiBold', 700:'Bold', 800:'ExtraBold', 900:'Black'}
const FONT_WEIGHTS = Object.keys(FONT_FACES).map(Number)
const fontPath = weight => fileURLToPath(
  new URL(`./assets/fonts/raleway/Raleway-${FONT_FACES[weight]}.ttf`, import.meta.url)
)

export default function drawText({createCanvas, getBitmap}){
    let size = 512,
        canvas = createCanvas(size, size),
        ctx = canvas.getContext('2d'),
        count = 400,
        rng = seed(process.env.SEED || 123)

    for (let i=0; i<count; i++){
        let x = rng.intBetween(0, size),
            y = rng.intBetween(0, size),
            weight = FONT_WEIGHTS[rng.intBetween(0, FONT_WEIGHTS.length-1)],
            fontSize = rng.intBetween(8, 200),
            char = String.fromCharCode(rng.intBetween(33, 93)),
            color = rng.intBetween(0, 255).toString(16)
        ctx.fillStyle = '#'+color+color+color
        ctx.font = `${weight} ${fontSize}px ${FONT_FAMILY}`
        ctx.fillText(char, x, y)
    }

    return getBitmap(canvas)
}

// add a pre-test setup hook to register the fonts
drawText.setup = ({loadFont}) => {
    for (let weight of FONT_WEIGHTS){
        loadFont(fontPath(weight), {family:FONT_FAMILY, weight, style:'normal'})
    }
}
