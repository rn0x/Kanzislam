import domtoimage from '/js/modules/dom-to-image.min.js';
import prayerTimes from '/js/modules/prayerTimes.js';

document.addEventListener("DOMContentLoaded", async function () {
    const screenshot = document.getElementById("screenshot");
    const prayerPage = document.getElementById("prayerPage");
    const logoScreen = document.getElementById("logoScreen");
    const loading = document.getElementById("loading");
    const isPermissionLocation = document.getElementById("isPermissionLocation");
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");
    const timezone = localStorage.getItem("timezone");
    const getLocation = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude; // خط العرض
            const longitude = position.coords.longitude; // خط الطول
            const timezone = new Date().getTimezoneOffset();
            resolve({
                latitude,
                longitude,
                timezone,
            })
        }, (error) => {
            resolve(false)
            reject(error.message)
        }, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
        });
    });



    if (getLocation || (latitude && longitude && timezone)) {

        loading.style.display = "block";

        setInterval(() => {
            const latitude = localStorage.getItem("latitude");
            const longitude = localStorage.getItem("longitude");
            const timezoneStor = localStorage.getItem("timezone");
            const madhabStor = localStorage.getItem("madhab");
            const calculationStor = localStorage.getItem("calculation");
            const prayerData = prayerTimes({
                Calculation: calculationStor ? calculationStor : "UmmAlQura",
                latitude: latitude ? latitude : getLocation.latitude,
                longitude: longitude ? longitude : getLocation.longitude,
                Madhab: madhabStor ? madhabStor : "Shafi",
                Shafaq: "Ahmer",
                Timezone: timezoneStor ? timezoneStor : "Asia/Riyadh",
                // fajr: 0,
                // dhuhr: 0,
                // asr: 0,
                // maghrib: 0,
                // isha: 0
            });

            // Get the elements
            const BoxSunrise = document.getElementById("BoxSunrise");
            const BoxFajr = document.getElementById("BoxFajr");
            const BoxDhuhr = document.getElementById("BoxDhuhr");
            const BoxAsr = document.getElementById("BoxAsr");
            const BoxMaghrib = document.getElementById("BoxMaghrib");
            const BoxIsha = document.getElementById("BoxIsha");
            const hour_minutes = document.getElementById("hour_minutes");
            const seconds = document.getElementById("seconds");
            const data_hijri = document.getElementById("data_hijri");
            const data_today = document.getElementById("data_today");
            const data_Gregorian = document.getElementById("data_Gregorian");
            const timezone = document.getElementById("timezone");
            const RemainingTime = document.getElementById("RemainingTime");
            const PrayerFajr = document.getElementById("PrayerFajr");
            const PrayerSunrise = document.getElementById("PrayerSunrise");
            const PrayerDhuhr = document.getElementById("PrayerDhuhr");
            const PrayerAsr = document.getElementById("PrayerAsr");
            const PrayerMaghrib = document.getElementById("PrayerMaghrib");
            const PrayerIsha = document.getElementById("PrayerIsha");
            const remaining_name = document.getElementById("remaining_name");
            const BoxRemainingTime = document.getElementById("BoxRemainingTime");

            hour_minutes.innerText = prayerData.hour_minutes;
            seconds.innerText = prayerData.seconds;
            data_hijri.innerText = prayerData.data_hijri;
            data_today.innerText = prayerData.today;
            data_Gregorian.innerText = prayerData.data_Gregorian;
            timezone.innerText = prayerData.timezone;
            RemainingTime.innerText = prayerData.remainingNext;
            PrayerSunrise.innerText = prayerData.sunrise;
            PrayerFajr.innerText = prayerData.fajr;
            PrayerDhuhr.innerText = prayerData.dhuhr;
            PrayerAsr.innerText = prayerData.asr;
            PrayerMaghrib.innerText = prayerData.maghrib;
            PrayerIsha.innerText = prayerData.isha;
            remaining_name.innerText = prayerData.nextPrayer;

            // Reset the styles to their default values
            const resetStyles = () => {
                BoxSunrise.style.backgroundColor = "";
                BoxSunrise.style.color = "";
                PrayerSunrise.style.color = "";

                BoxFajr.style.backgroundColor = "";
                BoxFajr.style.color = "";
                PrayerFajr.style.color = "";

                BoxDhuhr.style.backgroundColor = "";
                BoxDhuhr.style.color = "";
                PrayerDhuhr.style.color = "";

                BoxAsr.style.backgroundColor = "";
                BoxAsr.style.color = "";
                PrayerAsr.style.color = "";

                BoxMaghrib.style.backgroundColor = "";
                BoxMaghrib.style.color = "";
                PrayerMaghrib.style.color = "";

                BoxIsha.style.backgroundColor = "";
                BoxIsha.style.color = "";
                PrayerIsha.style.color = "";
            };

            // Update the styles based on the next prayer
            const updateStyles = () => {
                resetStyles();

                if (prayerData.nextPrayer === "none") {
                    BoxRemainingTime.style.display = "none";
                } else {
                    BoxRemainingTime.style.display = "block";

                    if (prayerData.nextPrayer === "sunrise") {
                        BoxSunrise.style.backgroundColor = "#ff4646";
                        BoxSunrise.style.color = "#ffffff";
                        PrayerSunrise.style.color = "#ffffff";
                    } else if (prayerData.nextPrayer === "fajr") {
                        BoxFajr.style.backgroundColor = "#ff4646";
                        BoxFajr.style.color = "#ffffff";
                        PrayerFajr.style.color = "#ffffff";
                    } else if (prayerData.nextPrayer === "dhuhr") {
                        BoxDhuhr.style.backgroundColor = "#ff4646";
                        BoxDhuhr.style.color = "#ffffff";
                        PrayerDhuhr.style.color = "#ffffff";
                    } else if (prayerData.nextPrayer === "asr") {
                        BoxAsr.style.backgroundColor = "#ff4646";
                        BoxAsr.style.color = "#ffffff";
                        PrayerAsr.style.color = "#ffffff";
                    } else if (prayerData.nextPrayer === "maghrib") {
                        BoxMaghrib.style.backgroundColor = "#ff4646";
                        BoxMaghrib.style.color = "#ffffff";
                        PrayerMaghrib.style.color = "#ffffff";
                    } else if (prayerData.nextPrayer === "isha") {
                        BoxIsha.style.backgroundColor = "#ff4646";
                        BoxIsha.style.color = "#ffffff";
                        PrayerIsha.style.color = "#ffffff";
                    }
                }
            };

            // Call the updateStyles function
            updateStyles();
        }, 1000);

        loading.style.display = "none";

        screenshot.addEventListener("click", async () => {
            screenshot.style.display = "none";
            logoScreen.style.display = "block";
            const elementWidth = prayerPage.offsetWidth ? prayerPage.offsetWidth : prayerPage.clientWidth ? prayerPage.clientWidth : window.innerWidth;
            const elementHeight = prayerPage.offsetHeight ? prayerPage.offsetHeight : prayerPage.clientHeight ? prayerPage.clientHeight : window.innerHeight;
            const ToPng = await domtoimage.toPng(prayerPage, { bgcolor: '#eceff4', width: elementWidth, height: elementHeight + 20 });
            const link = document.createElement('a');

            link.download = `أوقات_الصلاة_${new Date().toLocaleDateString().split("/").join("_")}.png`;
            link.href = ToPng;
            link.click();
            screenshot.style.display = "block";
            logoScreen.style.display = "none";
        });
    }

    else {
        prayerPage.style.display = "none";
        isPermissionLocation.style.display = "block";
    }

});