const $form = document.querySelector("#employmentform");
const $error = $form.querySelector(".form__submit--response");
const $loader = $form.querySelector("button[type='submit']");

if (!$form) {
    // TODO something went wrong show alert
}

$form.addEventListener("submit", e => {
    e.preventDefault();

    $loader.classList.add("is-loading");

    const elements = $form.elements;
    var payload ={};

    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        if (!item.hidden) {
            payload[item.name] = item.value;
        }
    }

    const promise = fetch("https:////formspree.io/f/tclawncarellc@gmail.com", {
        method: "POST",
        body: JSON.stringify(payload)
    })
        .then((response) => {
            if (!response.ok) {
                $error.classList.remove("is-success");
                $error.classList.add("is-danger");
                $error.textContent = "Sorry your request was not submitted! " + response.statusText;
            } else {
                $error.classList.remove("is-danger");
                $error.classList.add("is-success");
                $error.textContent = "Thank you!";
            }
        })
        .catch((response) => {
            $error.textContent = "Sorry your request was not submitted! " + response.statusText;
        })
        .finally(() => $loader.classList.remove("is-loading"));
});
