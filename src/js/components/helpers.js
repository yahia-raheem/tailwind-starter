import {imgTosvg} from "./helper-funcs";
document.addEventListener("DOMContentLoaded", () => {
  // constants for various functions explained below (just comment the constant and the script is no longer excuted)
  
  const doTrim = document.querySelectorAll("[data-trim]");
  const detImages = document.querySelectorAll(".det-res-img");
  const sReplace = document.querySelectorAll("[data-replace]");
  const mobSheet = document.querySelectorAll("[data-mobilesheet]");
  const sWidth = screen.width;
  const removeChildTag = document.querySelectorAll("[data-removeChildTag]");
  const aspectRatio = document.querySelectorAll('[data-aspectRatio]');
  const colorDivs = document.querySelectorAll('[data-color]');
  const menuIcons = document.querySelectorAll(".menu-icon");
  const selectInputs = document.querySelectorAll(".wpcf7 select");

  // colors the select field with the placeholder color until the first option is changed (first options's value has to be empty and the cf7 mixin has to be used)
  if (typeof selectInputs != "undefined" && selectInputs.length > 0) {
    selectInputs.forEach((select) => {
      if (select.value == "") {
        select.classList.add("untouched");
      }
      const changeEvent = (e) => {
        console.log('fired')
        select.classList.remove("untouched");
        removeChangeEvent();
      };
      const removeChangeEvent = () => {
        select.removeEventListener("change", changeEvent);
      };
      select.addEventListener("change", changeEvent);
    });
  }

  // adds icons to the navigation menu item if both ".menu-icon" and "icon-[image id]" classes exist in extra classes (this depends on an api endpoint)
  if (typeof menuIcons !== "undefined" && menuIcons.length > 0) {
    const baseUrl = window.location.origin;
    menuIcons.forEach((one, i) => {
      const iconId = Array.from(one.classList).find((single) =>
        /^icon-/.test(single)
      );
      if (iconId) {
        const requestUrl = `${
          baseUrl
        }/wp-json/generaldata/v1/getimage/${iconId.split("-")[1]}`;
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const resPure = JSON.parse(this.responseText).trim();
            const parentDiv = document.createElement("div");
            parentDiv.innerHTML = resPure;
            const img = parentDiv.querySelector("img");
            one.prepend(img);
            one.classList.remove(iconId)
            // imgTosvg({'element': img, 'index': i});
          }
        };
        xhttp.open("GET", requestUrl, true);
        xhttp.send();
      }
    });
  }

  // finds all occurances of data-color and makes a css variable named --elm-color available to the div for it and all of its decendants
  if (typeof colorDivs !== 'undefined' && colorDivs.length > 0) {
    colorDivs.forEach((one) => {
      const color = one.getAttribute('data-color');
      one.style.setProperty("--elm-color", color);
    });
  }

  // trims strings to be as long as the provided length in the 'data-trim' attribute
  if (typeof doTrim !== 'undefined' && doTrim.length > 0) {
    doTrim.forEach((one) => {
      var length = one.getAttribute("data-trim");
      one.innerHTML =
        one.innerHTML.length > length
          ? one.innerHTML.substring(0, length) + "..."
          : one.innerHTML;
      one.removeAttribute("data-trim");
    });
  }

  // determine the appropriate image to use when different images are used on mobile and desktop
  // if (typeof detImages !== 'undefined' && detImages.length > 0) {
  //   detImages.forEach((one) => {
  //     if (sWidth >= 768) {
  //       one.setAttribute(
  //         "data-srcset",
  //         one.getAttribute("data-srcset-desktop")
  //       );
  //       one.setAttribute("data-src", one.getAttribute("data-src-desktop"));
  //     } else {
  //       one.setAttribute("data-srcset", one.getAttribute("data-srcset-mobile"));
  //       one.setAttribute("data-src", one.getAttribute("data-src-mobile"));
  //     }
  //     one.removeAttribute("data-srcset-desktop");
  //     one.removeAttribute("data-srcset-mobile");
  //     one.removeAttribute("data-src-desktop");
  //     one.removeAttribute("data-src-mobile");
  //     one.classList.add("lazyload");
  //   });
  // }

  // replaces a character with another based on both 'data-replace' and 'data-replaced-with' and removes the attributes after its done
  // if (typeof sReplace !== 'undefined' && sReplace.length > 0) {
  //   sReplace.forEach((one) => {
  //     var replaced = one.getAttribute("data-replace");
  //     var replaceWith = one.getAttribute("data-replace-with");
  //     if (replaced && replaceWith) {
  //       one.innerHTML = one.innerHTML.replace(replaced, replaceWith);
  //       one.removeAttribute("data-replace");
  //       one.removeAttribute("data-replace-with");
  //     }
  //   });
  // }

  // removes an html tag from children of a node.
  // if (typeof removeChildTag !== 'undefined' && removeChildTag.length > 0) {
  //   removeChildTag.forEach((one) => {
  //     let tag = one.getAttribute("data-removeChildTag");
  //     let b = one.getElementsByTagName(tag);
  //     while (b.length) {
  //       let parent = b[0].parentNode;
  //       while (b[0].firstChild) {
  //         parent.insertBefore(b[0].firstChild, b[0]);
  //       }
  //       parent.removeChild(b[0]);
  //     }
  //   });
  // }

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
  // if (typeof mobSheet !== 'undefined' && mobSheet.length > 0) {
  //   mobSheet.forEach((one) => {
  //     dict = one.getAttribute("data-mobilesheet");
  //     data = JSON.parse(dict);
  //     one.style.transition = "height 0.5s, box-shadow 0.2s";
  //     let buttons = one.querySelectorAll("[data-open]");
  //     if (buttons) {
  //       buttons.forEach((button) => {
  //         button.addEventListener("click", () => {
  //           if (!one.classList.contains("open")) {
  //             openSheet(one);
  //           } else {
  //             closeSheet(one);
  //           }
  //         });
  //       });
  //     }
  //   });
  // }

  // determine height based on width (aspect ratio)
  if (typeof aspectRatio !== 'undefined' && aspectRatio.length > 0) {
    aspectRatio.forEach((one) => {
      let width = one.offsetWidth;
      let aspectRatio = one.getAttribute('data-aspectRatio');
      let height = detHeight(aspectRatio, width);
      one.style.height = `${height}px`;
    });
    window.addEventListener('resize', () => {
      aspectRatio.forEach((one) => {
        let width = one.offsetWidth;
        let aspectRatio = one.getAttribute('data-aspectRatio');
        let height = detHeight(aspectRatio, width);
        one.style.height = `${height}px`;
      });
    });
  }
});

const detHeight = (aspectRatio, width) => {
  let data = aspectRatio.split('/');
  let aspectWidth = data[0];
  let aspectHeight = data[1];
  let height = parseInt(width) * parseInt(aspectHeight) / parseInt(aspectWidth);
  return height;
}

const openSheet = (element) => {
  let buttons = element.querySelectorAll("[data-open]");
  element.classList.add("shadow-vail", "open");
  element.style.height = data.expandedHeight;
  buttons.forEach((button) => {
    button.setAttribute("data-open", "true");
    data.removedClasses
      ? data.removedClasses.forEach((rclass) => {
        element
          .querySelector(`.${rclass.divClass}`)
          .classList.remove(rclass.toRemove);
      })
      : null;
    data.addedClasses
      ? data.addedClasses.forEach((aclass) => {
        element
          .querySelector(`.${aclass.divClass}`)
          .classList.add(aclass.toAdd);
      })
      : null;
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
  let buttons = element.querySelectorAll("[data-open]");
  element.classList.remove("shadow-vail", "open");
  element.style.height = data.normalHeight;
  buttons.forEach((button) => {
    button.setAttribute("data-open", "false");
    data.removedClasses
      ? data.removedClasses.forEach((rclass) => {
        element
          .querySelector(`.${rclass.divClass}`)
          .classList.add(rclass.toRemove);
      })
      : null;
    data.addedClasses
      ? data.addedClasses.forEach((aclass) => {
        element
          .querySelector(`.${aclass.divClass}`)
          .classList.remove(aclass.toAdd);
      })
      : null;
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

