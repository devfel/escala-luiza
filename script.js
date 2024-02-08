document.addEventListener("DOMContentLoaded", () => {
  loadTablesFromStorage();
  document.getElementById("printPDF").addEventListener("click", printPDF);
  document.getElementById("clearTables").addEventListener("click", clearTables);
  document.getElementById("tableForm").addEventListener("submit", addTable);
});

function addTable(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Capture the form data
  const tableData = {
    date: document.getElementById("dataDate").value,
    responsavel: document.getElementById("responsavel").value,
    comentario: document.getElementById("comentario").value,
    primeiraLeitura: document.getElementById("primeiraLeitura").value,
    segundaLeitura: document.getElementById("segundaLeitura").value,
    preces: document.getElementById("preces").value,
  };

  // Retrieve existing tables from storage, add the new table, and save back to storage
  const tablesData = JSON.parse(localStorage.getItem("tablesData")) || [];
  tablesData.push([tableData]); // Add new table as a new array element
  saveTablesToStorage(tablesData);

  // Clear form fields
  document.getElementById("tableForm").reset();

  // Reload tables display
  loadTablesFromStorage();
}

function loadTablesFromStorage() {
  const tablesData = JSON.parse(localStorage.getItem("tablesData")) || [];
  const container = document.getElementById("tablesContainer");
  container.innerHTML = ""; // Clear existing content

  tablesData.forEach((table, index) => {
    const blockElement = document.createElement("div");
    blockElement.classList.add("tableBlock");
    let html = `<span class="date">${table[0].date}</span>`;

    table.forEach((row) => {
      html += `<div class="item"><strong>Responsável:</strong> ${row.responsavel}</div>
                   <div class="item"><strong>Comentário:</strong> ${row.comentario}</div>
                   <div class="item"><strong>Primeira Leitura:</strong> ${row.primeiraLeitura}</div>
                   <div class="item"><strong>Segunda Leitura:</strong> ${row.segundaLeitura}</div>
                   <div class="item"><strong>Preces:</strong> ${row.preces}</div>`;
    });

    // Adiciona o botão de deletar
    html += `<button class="deleteTableBtn" onclick="deleteTable(${index})">Excluir</button>`;

    blockElement.innerHTML = html;
    container.appendChild(blockElement);
  });
}

function saveTablesToStorage(tablesData) {
  localStorage.setItem("tablesData", JSON.stringify(tablesData));
}

function printPDF() {
  //window.print(); // Simple way to print current page, might need adjustment for PDF formatting
  const { jsPDF } = window.jspdf; // Acessa jsPDF no escopo global
  const doc = new jsPDF();

  // Inicia na posição y = 10, que será atualizada ao adicionar texto
  let y = 10;

  // Adiciona o título
  doc.text("Celebrações", 10, y);
  y += 10; // Incrementa a posição y para o próximo texto

  // Encontra todos os blocos de tabela
  const tableBlocks = document.querySelectorAll(".tableBlock");

  // Itera sobre cada bloco de tabela
  tableBlocks.forEach((block) => {
    const date = block.querySelector(".date").textContent;
    const items = block.querySelectorAll(".item");

    // Configura a fonte para negrito antes de adicionar a data
    doc.setFont("helvetica", "bold");

    // Adiciona a data e incrementa a posição y
    doc.text(date, 10, y);
    y += 7; // Espaço antes dos itens

    // Reverte para a fonte normal para o restante do texto
    doc.setFont("helvetica", "normal");

    // Itera sobre cada item dentro do bloco de tabela
    items.forEach((item) => {
      let text = item.textContent;
      // Adiciona o texto do item, verifica se precisa de uma nova linha baseado na largura do texto
      doc.text(text, 10, y, { maxWidth: 190 });
      y += 7; // Incrementa y para o próximo item
    });

    y += 10; // Espaço extra antes do próximo bloco de tabela
  });

  // Verifica se o conteúdo excede o limite da página e, caso positivo, adiciona uma nova página
  if (y > 280) {
    doc.addPage();
    y = 10; // Reseta a posição y para o topo da nova página
  }

  // Salva o PDF gerado
  doc.save("evento.pdf");
}

function clearTables() {
  localStorage.removeItem("tablesData");
  loadTablesFromStorage(); // Refresh tables display
}

function deleteTable(index) {
  let tablesData = JSON.parse(localStorage.getItem("tablesData")) || [];
  // Remove a tabela com o índice especificado
  tablesData.splice(index, 1);
  // Salva a nova lista de tabelas no armazenamento local
  saveTablesToStorage(tablesData);
  // Recarrega as tabelas para atualizar a exibição
  loadTablesFromStorage();
}

// Example of adding a table (this could be adapted to add tables dynamically based on user input)
const exampleTablesData = [
  // Table data here
];
saveTablesToStorage(exampleTablesData);
