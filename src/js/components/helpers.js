import { magnify } from "./helper-funcs";

// trims strings to be as long as the provided length in the 'data-trim' attribute
export const trimText = () => {
  const doTrim = document.querySelectorAll("[data-trim]");
  if (doTrim.length > 0) {
    doTrim.forEach((one) => {
      const length = one.getAttribute("data-trim");
      one.innerHTML =
        one.innerHTML.length > length
          ? one.innerHTML.substring(0, length) + "..."
          : one.innerHTML;
      one.removeAttribute("data-trim");
    });
  }
};

// open bottom sheet (similar to the material bottom sheet) you should pass the following dictionary to it
// var dict = {
//   normalHeight: 'normal div height when the sheet is collapsed',
//   expandedHeight: 'expanded div height',
//   removedClasses: [
//     {
//       divClass: 'a class that always exists on the div that u want to remove a class from',
//       toRemove: 'a class to remove',
//     },
//   ],
//   addedClasses: [
//     {
//       divClass: 'a class that always exists on the div that u want to add a class to',
//       toAdd: 'a class to add',
//     },
//   ],
//   changedClasses: [
//     {
//       divClass: 'a class that always exists on the div that u want to add or remove a class to',
//       toChange: 'a class to change',
//       changeWith: 'the class to replace "to change" class with'
//     },
//   ]
// };
export const mobileSheet = () => {
  const mobSheet = document.querySelectorAll("[data-mobilesheet]");
  if (mobSheet.length > 0) {
    mobSheet.forEach((one) => {
      one.style.transition = "height 0.5s, box-shadow 0.2s";
      const buttons = one.querySelectorAll("[data-open]");
      if (buttons) {
        buttons.forEach((button) => {
          button.addEventListener("click", () => {
            if (!one.classList.contains("open")) {
              openSheet(one);
            } else {
              closeSheet(one);
            }
          });
        });
      }
    });
  }
};

// removes an html tag from children of a node.
export const removeChild = () => {
  const removeChildTag = document.querySelectorAll("[data-removeChildTag]");
  if (removeChildTag.length > 0) {
    removeChildTag.forEach((one) => {
      const tag = one.getAttribute("data-removeChildTag");
      const b = one.getElementsByTagName(tag);
      while (b.length) {
        const parent = b[0].parentNode;
        while (b[0].firstChild) {
          parent.insertBefore(b[0].firstChild, b[0]);
        }
        parent.removeChild(b[0]);
      }
    });
  }
};

// colors the select field with the placeholder color until the first option is changed (first options's value has to be empty and the cf7 mixin has to be used)
export const cf7Select = () => {
  const selectInputs = document.querySelectorAll(".wpcf7 select");
  if (selectInputs.length > 0) {
    selectInputs.forEach((select) => {
      if (select.value === "") {
        select.classList.add("untouched");
      }
      const changeEvent = (e) => {
        select.classList.remove("untouched");
        removeChangeEvent();
      };
      const removeChangeEvent = () => {
        select.removeEventListener("change", changeEvent);
      };
      select.addEventListener("change", changeEvent);
    });
  }
};

// adds icons to the navigation menu item if both ".menu-icon" and "icon-[image id]" classes exist in extra classes (this depends on an api endpoint)
export const addIcon = () => {
  const menuIcons = document.querySelectorAll(".menu-icon");
  if (menuIcons.length > 0) {
    const baseUrl = window.location.origin;
    menuIcons.forEach((one, i) => {
      const iconId = Array.from(one.classList).find((single) =>
        /^icon-/.test(single)
      );
      if (iconId) {
        const requestUrl = `${baseUrl}/wp-json/generaldata/v1/getimage/${
          iconId.split("-")[1]
        }`;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            const resPure = JSON.parse(this.responseText).trim();
            const parentDiv = document.createElement("div");
            parentDiv.innerHTML = resPure;
            const img = parentDiv.querySelector("img");
            one.prepend(img);
            one.classList.remove(iconId);
            // imgTosvg({'element': img, 'index': i});
          }
        };
        xhttp.open("GET", requestUrl, true);
        xhttp.send();
      }
    });
  }
};

// finds all occurances of data-color and makes a css variable named --elm-color available to the div for it and all of its decendants
export const colorDivsHelper = () => {
  const colorDivs = document.querySelectorAll("[data-color]");
  if (colorDivs.length > 0) {
    colorDivs.forEach((one) => {
      const color = one.getAttribute("data-color");
      one.style.setProperty("--elm-color", color);
    });
  }
};

// determine height based on width (aspect ratio)
export const aspectRatioHelper = () => {
  const aspectRatio = document.querySelectorAll("[data-aspectRatio]");
  if (aspectRatio.length > 0) {
    aspectRatio.forEach((one) => {
      const width = one.offsetWidth;
      const aspectRatio = one.getAttribute("data-aspectRatio");
      const height = detHeight(aspectRatio, width);
      one.style.height = `${height}px`;
    });
    window.addEventListener("resize", () => {
      aspectRatio.forEach((one) => {
        const width = one.offsetWidth;
        const aspectRatio = one.getAttribute("data-aspectRatio");
        const height = detHeight(aspectRatio, width);
        one.style.height = `${height}px`;
      });
    });
  }
};

// adds magnification lense to images
export const magnifyImages = () => {
  const images = document.querySelectorAll('[data-magnify]')
  if (images.length > 0) {
    images.forEach((el) => {
      magnify(el, 3);
    })
  }
}

const detHeight = (aspectRatio, width) => {
  const data = aspectRatio.split("/");
  const aspectWidth = data[0];
  const aspectHeight = data[1];
  const height =
    (parseInt(width) * parseInt(aspectHeight)) / parseInt(aspectWidth);
  return height;
};

const openSheet = (element) => {
  const buttons = element.querySelectorAll("[data-open]");
  const data = element.getAttribute('data-mobilesheet');
  element.classList.add("shadow-vail", "open");
  element.style.height = data.expandedHeight;
  buttons.forEach((button) => {
    button.setAttribute("data-open", "true");
    // eslint-disable-next-line no-unused-expressions
    data.removedClasses
      ? data.removedClasses.forEach((rclass) => {
          element
            .querySelector(`.${rclass.divClass}`)
            .classList.remove(rclass.toRemove);
        })
      : null;
    // eslint-disable-next-line no-unused-expressions
    data.addedClasses
      ? data.addedClasses.forEach((aclass) => {
          element
            .querySelector(`.${aclass.divClass}`)
            .classList.add(aclass.toAdd);
        })
      : null;
    // eslint-disable-next-line no-unused-expressions
    data.changedClasses
      ? data.changedClasses.forEach((cclass) => {
          element
            .querySelector(`.${cclass.divClass}`)
            .classList.remove(cclass.toChange);
          element
            .querySelector(`.${cclass.divClass}`)
            .classList.add(cclass.changeWith);
        })
      : null;
  });
  hideOnClickOutside(element);
};

const closeSheet = (element) => {
  const buttons = element.querySelectorAll("[data-open]");
  const data = element.getAttribute('data-mobilesheet');
  element.classList.remove("shadow-vail", "open");
  element.style.height = data.normalHeight;
  buttons.forEach((button) => {
    button.setAttribute("data-open", "false");
    // eslint-disable-next-line no-unused-expressions
    data.removedClasses
      ? data.removedClasses.forEach((rclass) => {
          element
            .querySelector(`.${rclass.divClass}`)
            .classList.add(rclass.toRemove);
        })
      : null;
    // eslint-disable-next-line no-unused-expressions
    data.addedClasses
      ? data.addedClasses.forEach((aclass) => {
          element
            .querySelector(`.${aclass.divClass}`)
            .classList.remove(aclass.toAdd);
        })
      : null;
    // eslint-disable-next-line no-unused-expressions
    data.changedClasses
      ? data.changedClasses.forEach((cclass) => {
          element
            .querySelector(`.${cclass.divClass}`)
            .classList.add(cclass.toChange);
          element
            .querySelector(`.${cclass.divClass}`)
            .classList.remove(cclass.changeWith);
        })
      : null;
  });
};

const hideOnClickOutside = (element) => {
  const outsideClickListener = (event) => {
    if (!element.contains(event.target) && isVisible(element)) {
      closeSheet(element);
      document.removeEventListener("click", outsideClickListener);
    }
  };
  document.addEventListener("click", outsideClickListener);
};

const isVisible = (elem) =>
  !!elem &&
  !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
