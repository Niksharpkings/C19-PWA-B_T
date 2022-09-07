let transactions = [];
let myChart;

const t_nameEl = document.querySelector("#t-name");
const t_amountEl = document.querySelector("#t-amount");
const form_errorEl = document.querySelector(".form .error");
const enumerateEl = document.querySelector("#total");
const tbody = document.querySelector("#tbody");
const trEl = document.createElement("tr");
const ctx = document.getElementById("myChart").getContext("2d");

fetch("/api/transaction")
  .then(response => response.json())
  .then(d => {
      transactions = d;
      popAmount();
      popTable();
      popChart();
    });

const popAmount = () => {
  const enumerate = transactions.reduce((enumerate, amount) => parseInt(amount.value) + enumerate, 0);
  enumerateEl.textContent = enumerate;
};

const popTable = () => {
  tbody.innerHTML = "";
  transactions.forEach((transaction) => {
      trEl.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;
      tbody
        .appendChild(trEl);
    });
};

const popChart = () => {
    const reversed = transactions
  .slice()
  .reverse();
    let sum = 0;
    const labels = reversed.map(t => {
      const date = new Date(t.date);
      return `${1 + date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    });
    const data = reversed.map((t) => {
        sum += parseInt(t.value);
        return sum;
      });
    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, {
      type: 'line',
        data: {
          labels,
          datasets: [{
              label: "Amount Over TimeStamp",
              fill: true,
              backgroundColor: "green",
              data
          }]
      }
    });
};
const sendTransaction = (isAdding) => {
  switch ("") {
    case t_nameEl.value:
    case t_amountEl.value:
      form_errorEl.textContent = "Please Input A Transaction Amount & Name";
      return;
  }
  form_errorEl.textContent = "";
  const transaction = {
    name: t_nameEl.value,
    value: t_amountEl.value,
    date: new Date().toISOString()
  };
  if (!isAdding) {
    transaction.value *= -1;
  }
  transactions
    .unshift(transaction);
  popChart();
  popTable();
  popAmount();
  fetch("/api/transaction", {
    method: "POST",
    body: JSON
      .stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    if (!data.errors) {
      t_nameEl.value = "";
      t_amountEl.value = "";
      return;
    }
    form_errorEl.textContent = "Please Provide Both A Transaction Amount & Name";
  })
  .catch((_error) => {
    saveRecord(transaction);
    t_nameEl.value = "";
    t_amountEl.value = "";
  });
};

document
  .querySelector("#add-btn")
  .onclick = () => {
  sendTransaction(true);
};

document
  .querySelector("#sub-btn")
  .onclick = () => {
  sendTransaction(false);
};
