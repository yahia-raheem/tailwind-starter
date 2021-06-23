import { elementObserver } from './helper-funcs';

const animateCSS = (node, animation, prefix = 'animate__', delay = null) =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;

        node.classList.add(`${prefix}animated`, animationName);
        if (delay) {
            node.style.animationDelay = delay;
        }
        node.removeAttribute('data-animate');

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd() {
            node.classList.remove(`${prefix}animated`, animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd);
    });



const doAnimation = (options) => {

    if (options.element.getAttribute('data-animate')) {
        animateCSS(options.element, options.animation, 'animate__', options.delay);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const elanimations = document.querySelectorAll('[data-animate]');
    elanimations.forEach(element => {
        let animation = element.getAttribute('data-animate');
        if (document.getElementsByTagName("html")[0].getAttribute("dir") == 'ltr' && (animation.includes('Left') || animation.includes('Right'))) {
            animation = animation.includes('Left') ? animation.replace('Left', 'Right') : animation.replace('Right', 'Left');
        }
        let delay = element.getAttribute('data-delay');
        elementObserver(doAnimation, { "animation": animation, "element": element, "delay": delay });
    });
});