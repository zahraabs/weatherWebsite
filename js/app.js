const link = document.querySelector(".post-job--search .post-job__search-icon");
const modal = document.querySelector(".modal");
const close = modal.querySelector("i");
const inp = modal.querySelector("input");

link.addEventListener("click" , showModal);
close.addEventListener("click" , closeModal);

function showModal() {
    modal.style.transform = `scale(1)`;
    inp.focus();
}

function closeModal() {
    modal.style.transform = `scale(0)`;
    inp.value = "";
}