import { elementObserver, imgTosvg } from './helper-funcs'

document.addEventListener('DOMContentLoaded', () => {
  const svgImages = document.querySelectorAll('.style-svg')
  svgImages.forEach((img, index) => {
    elementObserver(imgTosvg, { element: img, index })
  })
})
