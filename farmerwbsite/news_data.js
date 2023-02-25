// Select the table element
const newsTable = document.querySelector("#newsTable");

// Fetch the CSV data
fetch("data.csv")
  .then(response => response.text())
  .then(data => {
    // Parse the CSV data
    const newsData = Papa.parse(data, {header: true}).data;

    // Generate the HTML table rows
    let tableRows = "";
    for (let row of newsData) {
      tableRows += `
        <tr>
          <td>${row.Title}</td>
          <td><a href="${row.Details}">${row.Details}</a></td>
        </tr>
      `;
    }

    // Add the table rows to the table body
    const tableBody = newsTable.querySelector("tbody");
    tableBody.innerHTML = tableRows;
  });

