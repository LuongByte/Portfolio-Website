//Universal Variables
let mouseX = 0;
let mouseY = 0;
let currSlide = 1;
const maxSlide = 4;

document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX/window.innerWidth) * 100;
    mouseY = (event.clientY/window.innerHeight) * 100;
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
        cpyTip.style.left = `${mouseX}%`;
        cpyTip.style.top = `${mouseY + -5}%`;
        cpyTip.style.transform = "translate(-50%, 0)";
        cpyTip.style.opacity = 1;
        document.body.append(cpyTip);
        setTimeout(() => {cpyTip.style.opacity = 0;

            setTimeout(() => {cpyTip.remove()}, 200);
        }, 1500);
    }
}

// Max Image Functionality
const overlay = document.getElementById("overlay");
overlay.addEventListener("click", (event) => {
    event.target.style.display = "none";
    document.querySelector(".maxIMG").remove();

})
let imgs = document.querySelectorAll(".expandable");


imgs.forEach(img => {
    img.title = "Expand";
    img.addEventListener("click", (event) => {
        maxImage(event.target.src);
        
    })
    
});
function maxImage(source){
    const maxIMG = document.createElement("img");
    maxIMG.src = source;
    maxIMG.classList.add("maxIMG");
    document.body.append(maxIMG);
    overlay.style.display = "block";
}

class Container{
    constructor(container){
        this.container = container;
    }

    async fetchText(location){
        try{
            const resp = await fetch(location);
            if(!resp.ok) throw new Error("Cannot fetch Text");
            const retText = await resp.text();
            return retText.split("\n")
        }catch(error){
            this.text = "Cannot load text";
            console.error('Fetch error:', error);
            return [];
        }
    }

    loadIMGS(location, imgs){
        let count = 1;
        imgs.forEach(img => {
            img.src = location.replace("X", count);
            count++;
        })

    }

}
//Slide Change Functionality
class Slide extends Container{
    constructor(slide){
        super(slide);
        this.updateSlide(1);
    }

    async updateSlide(val){
        const old = this.num;
        if(isNaN(val)){
            switch(val){
                case '+':
                    if(this.num < 3){
                        this.num++;
                        break;
                    }
                    else
                        return;
                case '-':
                    if(this.num > 1)
                        this.num--;
                    else
                        return;
            }
        }
        else{
            if(val === this.num)
                return;
            this.num = val;
        }
        
        const oldBut = document.getElementById(`slide${old}`);
        if(oldBut != null)
            oldBut.classList.remove("active-button");
        const texts = await this.fetchText("slides/text.txt");
        const para = this.container.querySelector("p");
        const header = this.container.querySelector("h1");
        const imgs = this.container.querySelectorAll("img");

        header.textContent = texts[this.num-1].split(';')[0];
        para.textContent = texts[this.num-1].split(';')[1];
        this.loadIMGS(`slides/s${this.num}.png`, imgs);

        const newBut = document.getElementById(`slide${this.num}`);
        newBut.classList.add("active-button");
        let arrow = document.querySelectorAll(".arrow-button");
        switch(this.num){
            case 1:
                arrow[0].style.display = "none";
                arrow[1].style.display = "block";
                break;
            case 3:
                arrow[0].style.display = "block";
                arrow[1].style.display = "none";
                break;
            default:
                arrow.forEach(arr => {arr.style.display = "block"})
        }
    }
}


if(document.getElementById("slide-contain") != null){
    const slides = new Slide(document.getElementById("slide-contain"));
    window.updateSlide = (num) => slides.updateSlide(num);
}


//Project Load Functionality
class Projects extends Container{
    constructor(projects){
        super(projects);
        this.loadProjects();
    }

    async loadProjects(){
        let line = "";
        let index = 1;
        const texts = await this.fetchText("projects/descriptions.txt");

        
        while(texts[index - 1].length !== 0){
            const newProj = document.createElement("a");
            newProj.classList.add("project");
            const line = texts[index - 1].split(';');
            this.fillProject(newProj, index, line);
            if(line[2].length == 0)
                newProj.title = "Unavailable";
            else{
                newProj.title = "Go To Project";
                newProj.href = line[2];
                newProj.target = "_blank";
            }
            this.container.append(newProj);
            index++;
        }
    }

    fillProject(proj, num, line){
        const header = document.createElement("h2");
        const para = document.createElement("p");
        const image = document.createElement("img");
        header.textContent = line[0];
        para.textContent = line[1];
        proj.append(image); proj.append(para); proj.append(header);

        this.loadIMGS(`projects/p${num}.png`, proj.querySelectorAll("img"));

    }
}


if(document.getElementById("project-contain") != null){
    const projects = new Projects(document.querySelector(".project-grid"))
}