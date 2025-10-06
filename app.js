const BASE_URL = "https://api.frankfurter.app";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

const countryList = {
  USD: "US",
  INR: "IN",
  EUR: "EU",
  GBP: "GB",
  AUD: "AU",
  CAD: "CA",
  SGD: "SG",
  JPY: "JP",
  CNY: "CN",
  CHF: "CH",
  SEK: "SE",
  NZD: "NZ",
  ZAR: "ZA",
  RUB: "RU",
  BRL: "BR",
  HKD: "HK",
  KRW: "KR",
  MXN: "MX",
  NOK: "NO",
  TRY: "TR",
  AED: "AE",
  SAR: "SA",
};

fetch(`${BASE_URL}/currencies`)
  .then(res => res.json())
  .then(data => {
    const entries = Object.entries(data);
    for (let [code, name] of entries) {
      let option1 = `<option value="${code}">${code}</option>`;
      let option2 = `<option value="${code}">${code}</option>`;
      fromCurr.innerHTML += option1;
      toCurr.innerHTML += option2;
    }

    fromCurr.value = "USD";
    toCurr.value = "INR";
    updateFlag(fromCurr);
    updateFlag(toCurr);
  });

function updateFlag(element) {
  let currencyCode = element.value;
  let countryCode = countryList[currencyCode] || "US"; // fallback
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

dropdowns.forEach(select => {
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
});

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let amount = amountInput.value;

  if (amount === "" || amount <= 0) {
    msg.innerText = "Please enter a valid amount!";
    return;
  }

  if (fromCurr.value === toCurr.value) {
    msg.innerText = "Please select two different currencies!";
    return;
  }

  let response = await fetch(
    `${BASE_URL}/latest?amount=${amount}&from=${fromCurr.value}&to=${toCurr.value}`
  );
  let data = await response.json();
  let rate = data.rates[toCurr.value];
  msg.innerText = `${amount} ${fromCurr.value} = ${rate} ${toCurr.value}`;
});
