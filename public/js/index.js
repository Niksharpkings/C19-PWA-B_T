let transactions = [];
let dataChart;

fetch("/api/transaction")
  .then(response => response.json())
  .then(data => {
    transactions = data;
    popAmount();
    popTable();
    popChart();
    });

const popAmount = () => {
  const enumerate = transactions.reduce((enumerate, total) => {
    return enumerate + parseInt(total.value);
  }, 0);
  const enumerateEl = document.querySelector("#total");
  enumerateEl.textContent = enumerate;
};

const popTable = () => {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";
  transactions.forEach((transaction) => {
      const trEl = document.createElement("tr");
      trEl.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;
      tbody
        .appendChild(trEl);
    });
};

function popChart() {
    const reversed = transactions.slice().reverse();
    let sum = 0;
    const labels = reversed.map(t => {
      const date = new Date(t.date);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });
    const data = reversed.map((t) => {
        sum += parseInt(t.value);
        return sum;
      });
    if (dataChart) {
      dataChart.destroy();
  }
    const ctx = document.getElementById("myChart").getContext("2d");
    dataChart = new Chart(ctx, {
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
}

const sendTransaction = (isAdding) => {
  const t_nameEl = document.querySelector("#t-name");
  const t_amountEl = document.querySelector("#t-amount");
  const form_errorEl = document.querySelector(".form .error");

  switch ("") {
    case t_nameEl.value:
    case t_amountEl.value:
      form_errorEl.textContent = "Please Input Both A Transaction Amount & Name";
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
  transactions.unshift(transaction);
  popChart();
  popTable();
  popAmount();
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.errors) {
      form_errorEl.textContent = "Please Provide Both A Transaction Amount & Name";
      return;
    }
    t_nameEl.value = "";
    t_amountEl.value = "";
  })
  .catch(err => {
    console.log(err);
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
