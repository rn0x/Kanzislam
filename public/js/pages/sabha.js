document.addEventListener("DOMContentLoaded", async function () {

    const options = window.options;
    const sabha_number = document.getElementById('sabha_number');
    const sabha = document.getElementById('sabha');
    const repetition_bt = document.getElementById('repetition_bt');

    sabha.addEventListener("click", e => {

        let number = Number(sabha_number.innerText) + 1;
        sabha_number.innerText = number;

    });

    repetition_bt.addEventListener("click", e => {
        e.stopPropagation();
        sabha_number.innerText = 0;
    });

});