//Universal Variables
let mouseX = 0;
let mouseY = 0;
let currSlide = 1;
const maxSlide = 4;

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientX;
});


//Copy to Clipboard Functionality
phoneNumber = document.getElementById("phonenumber");
phoneNumber.addEventListener("click", (event) => {copytoClip(event.currentTarget.textContent)});
function copytoClip(text){
    text = text.trim().replace(/-/g, "");
    navigator.clipboard.writeText(text);

    if(document.querySelectorAll(".copy-tooltip").length == 0){
        const cpyTip = document.createElement("div");
        cpyTip.textContent = "Copied!";
        cpyTip.classList.add("copy-tooltip");
        cpyTip.style.left = mouseX - 30 + "px";
        cpyTip.style.top = mouseY + 280 + "px";
        cpyTip.style.opacity = 1;
        document.body.append(cpyTip);
        setTimeout(() => {cpyTip.style.opacity = 0;

            setTimeout(() => {cpyTip.remove()}, 200);
        }, 1500);
    }
}