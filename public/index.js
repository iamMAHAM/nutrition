const block = document.querySelector('.partie1');

window.addEventListener('scroll', () => {
    console.log("azerty");
    if (window.scrollY >= 50) {
        block.classList.add('partie1-active');
    } else {
        block.classList.remove('partie1-active');
    }
})


// document.querySelector(".okoko").addEventListener("click", ()=>{
//     window.location.href = "/signup"
// })