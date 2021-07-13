export const setCookie = (name, value, days) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
export const getCookie = (name) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
export const eraseCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const elementObserver = (callback, options) => {
  if (typeof options.element !== 'undefined') {
    return new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(options)
          }
        })
      },
      {
        threshold: 0.5,
      }
    ).observe(options.element)
  }
}

export const matchHeight = (selector) => {
  const objects = document.querySelectorAll(selector)
  const heights = Array.from(objects).map((x, i, a) => {
    return x.offsetHeight
  })
  const max = Math.max(...heights)
  objects.forEach((el) => {
    el.style.height = `${max}px`
  })
}

export const hideOnClickOutside = (element, callback, check) => {
  const outsideClickListener = (event) => {
    if (!element.contains(event.target) && check) {
      callback()
      removeClickListener()
    }
  }

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }
  document.addEventListener('click', outsideClickListener)
}

export const imgTosvg = (options) => {
  const img = options.element
  const index = options.index
  const imgURL = img.getAttribute('src')
  const imgID = img.getAttribute('id')
  const imgWidth = img.getAttribute('width')
  const imgHeight = img.getAttribute('height')
  const imgClasses = img.getAttribute('class')
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const resPure = this.responseText.trim()
      const parentDiv = document.createElement('div')
      parentDiv.innerHTML = resPure
      const svg = parentDiv.querySelector('svg')
      if (svg != null) {
        if (imgID != null) {
          svg.setAttribute('id', imgID)
        } else {
          svg.setAttribute('id', `replaced-svg-${index}`)
        }
        svg.removeAttribute('xmlns:a')
        svg.setAttribute('class', imgClasses)
        // eslint-disable-next-line no-unused-expressions
        imgWidth !== null ? svg.setAttribute('width', imgWidth) : null
        // eslint-disable-next-line no-unused-expressions
        imgHeight !== null ? svg.setAttribute('height', imgHeight) : null
        img.parentNode.replaceChild(svg, img)
      }
    }
  }
  xhttp.open('GET', imgURL, true)
  xhttp.send()
}

export const magnify = (img, zoom) => {
  /* Create magnifier glass: */
  const glass = document.createElement('DIV')
  glass.setAttribute('class', 'img-magnifier-glass')

  /* Insert magnifier glass: */
  img.parentElement.insertBefore(glass, img)

  /* Set background properties for the magnifier glass: */
  glass.style.backgroundImage = "url('" + img.src + "')"
  glass.style.backgroundRepeat = 'no-repeat'
  glass.style.backgroundSize =
    img.width * zoom + 'px ' + img.height * zoom + 'px'
  const bw = 3
  const w = glass.offsetWidth / 2
  const h = glass.offsetHeight / 2

  /* Execute a function when someone moves the magnifier glass over the image: */
  glass.addEventListener('mousemove', moveMagnifier)
  img.addEventListener('mousemove', moveMagnifier)

  glass.addEventListener('touchmove', moveMagnifier)
  img.addEventListener('touchmove', moveMagnifier)
  function moveMagnifier(e) {
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault()
    /* Get the cursor's x and y positions: */
    const pos = getCursorPos(e)
    let x = pos.x
    let y = pos.y
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > img.width - w / zoom) {
      x = img.width - w / zoom
    }
    if (x < w / zoom) {
      x = w / zoom
    }
    if (y > img.height - h / zoom) {
      y = img.height - h / zoom
    }
    if (y < h / zoom) {
      y = h / zoom
    }
    /* Set the position of the magnifier glass: */
    glass.style.left = x - w + 'px'
    glass.style.top = y - h + 'px'
    /* Display what the magnifier glass "sees": */
    glass.style.backgroundPosition =
      '-' + (x * zoom - w + bw) + 'px -' + (y * zoom - h + bw) + 'px'
  }

  function getCursorPos(e) {
    let x = 0
    let y = 0
    e = e || window.event
    /* Get the x and y positions of the image: */
    const a = img.getBoundingClientRect()
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left
    y = e.pageY - a.top
    /* Consider any page scrolling: */
    x = x - window.pageXOffset
    y = y - window.pageYOffset
    return { x, y }
  }
}
