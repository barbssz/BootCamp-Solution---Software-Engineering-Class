

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Botão de edição para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertEditButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("✎");
  span.className = "edit";
  span.title = "Editar";
  span.style.marginRight = "8px";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item via requisição PUT
  --------------------------------------------------------------------------------------
*/
const putItem = (oldName, newName, newQuantity, newPrice) => {
  const formData = new FormData();
  formData.append('nome', oldName);
  if (newName !== null && newName !== undefined) formData.append('novo_nome', newName);
  if (newQuantity !== null && newQuantity !== undefined) formData.append('quantidade', newQuantity);
  if (newPrice !== null && newPrice !== undefined) formData.append('valor', newPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'put',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para anexar eventos de edição
  --------------------------------------------------------------------------------------
*/
const attachEditHandlers = () => {
  let edits = document.getElementsByClassName("edit");
  for (let i = 0; i < edits.length; i++) {
    edits[i].onclick = function () {
      let row = this.parentElement.parentElement;
      const oldName = row.getElementsByTagName('td')[0].innerHTML;
      const oldQty = row.getElementsByTagName('td')[1].innerHTML;
      const oldPrice = row.getElementsByTagName('td')[2].innerHTML;

      const newName = prompt('Novo nome (deixe vazio para manter):', oldName);
      const newQty = prompt('Nova quantidade (deixe vazio para manter):', oldQty);
      const newPrice = prompt('Novo valor (deixe vazio para manter):', oldPrice);

      // Validação simples
      if (newQty !== '' && newQty !== null && isNaN(newQty)) {
        alert('Quantidade precisa ser número!');
        return;
      }
      if (newPrice !== '' && newPrice !== null && isNaN(newPrice)) {
        alert('Valor precisa ser número!');
        return;
      }

      // Definir valores a enviar (mantém os antigos quando vazio)
      const sendName = (newName === '' || newName === null) ? null : newName;
      const sendQty = (newQty === '' || newQty === null) ? null : newQty;
      const sendPrice = (newPrice === '' || newPrice === null) ? null : newPrice;

      putItem(oldName, sendName, sendQty, sendPrice);

      // Atualiza a tabela localmente
      if (sendName !== null) row.getElementsByTagName('td')[0].innerHTML = sendName;
      if (sendQty !== null) row.getElementsByTagName('td')[1].innerHTML = sendQty;
      if (sendPrice !== null) row.getElementsByTagName('td')[2].innerHTML = sendPrice;

      alert('Item atualizado!');
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  const actionCell = row.insertCell(-1)
  insertEditButton(actionCell)
  insertButton(actionCell)
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
  attachEditHandlers()
}
