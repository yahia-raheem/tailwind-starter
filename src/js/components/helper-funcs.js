export const setCookie = (name, value, days) => {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
export const eraseCookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const elementObserver = (callback, options) => {
  if (typeof options.element != "undefined") {
    return new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          let target = entry.target;
          if (entry.isIntersecting) {
            callback(options);
          }
        });
      },
      {
        threshold: 0.5
      }
    ).observe(options.element);
  }
}

export const matchHeight = (selector) => {
  let objects = document.querySelectorAll(selector);
  let heights = Array.from(objects).map((x, i, a) => {
    return x.offsetHeight;
  });
  let max = Math.max(...heights);
  objects.forEach((el) => {
    el.style.height = `${max}px`;
  });
};

export const invertColor = (hex, bw) => {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
};

export const hideOnClickOutside = (element, callback, check) => {
  const outsideClickListener = (event) => {
    if (!element.contains(event.target) && check) {
      callback();
      removeClickListener();
    }
  };

  const removeClickListener = () => {
    document.removeEventListener("click", outsideClickListener);
  };
  document.addEventListener("click", outsideClickListener);
};

export const imgTosvg = (options) => {
  const img = options["element"];
  const index = options["index"];
  const imgURL = img.getAttribute("src");
  const imgID = img.getAttribute("id");
  const imgWidth = img.getAttribute("width");
  const imgHeight = img.getAttribute("height");
  const imgClasses = img.getAttribute("class");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const resPure = this.responseText.trim();
      const parentDiv = document.createElement("div");
      parentDiv.innerHTML = resPure;
      const svg = parentDiv.querySelector("svg");
      if (svg != null) {
        if (imgID != null) {
          svg.setAttribute("id", imgID);
        } else {
          svg.setAttribute("id", `replaced-svg-${index}`);
        }
        svg.removeAttribute("xmlns:a");
        svg.setAttribute("class", imgClasses);
        imgWidth != null ? svg.setAttribute("width", imgWidth) : null
        imgHeight != null ? svg.setAttribute("height", imgHeight) : null
        img.parentNode.replaceChild(svg, img);
      }
    }
  };
  xhttp.open("GET", imgURL, true);
  xhttp.send();
};

export const compareValues = (key, order = "asc") => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

export const sortArray = (arr, key, order) => {
  return [...arr].sort(compareValues(key, order));
}

export const magnify = (img, zoom) => {
  var glass, w, h, bw;
  
  /* Create magnifier glass: */
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");

  /* Insert magnifier glass: */
  img.parentElement.insertBefore(glass, img);

  /* Set background properties for the magnifier glass: */
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize =
    img.width * zoom + "px " + img.height * zoom + "px";
  bw = 3;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;

  /* Execute a function when someone moves the magnifier glass over the image: */
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);

  /*and also for touch screens:*/
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);
  function moveMagnifier(e) {
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > img.width - w / zoom) {
      x = img.width - w / zoom;
    }
    if (x < w / zoom) {
      x = w / zoom;
    }
    if (y > img.height - h / zoom) {
      y = img.height - h / zoom;
    }
    if (y < h / zoom) {
      y = h / zoom;
    }
    /* Set the position of the magnifier glass: */
    glass.style.left = x - w + "px";
    glass.style.top = y - h + "px";
    /* Display what the magnifier glass "sees": */
    glass.style.backgroundPosition =
      "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
  }

  function getCursorPos(e) {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
};