// Geo Movies

const search = document.querySelector("input");

search.addEventListener("keyup", function () {
    const text = this.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {

        const title = card.innerText.toLowerCase();

        if (title.includes(text)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
});

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", () => {

        alert("ფილმის გვერდი მალე დაემატება.");

    });

});
