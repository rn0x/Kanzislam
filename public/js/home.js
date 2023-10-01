document.addEventListener("DOMContentLoaded",async function () {
    
    const options = window.options
    document.getElementById("k4").innerText = JSON.stringify(options, null, 4)
    console.log(options);
});