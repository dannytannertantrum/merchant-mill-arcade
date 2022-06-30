const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let { width, height } = canvas
const colors = ['#a8a8a8', '#eeeeee', '#68417a', '#747a41']
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

for (let i = 0; i < 700; i++) {
    let x = Math.random() * width
    let y = Math.random() * height
    let radius = Math.random() * 2

    ctx.fillStyle = getRandomColor()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
}
