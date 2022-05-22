import {Template} from '../modules/Template.js';
import {Api} from '../modules/Api.js';
import {Filter} from '../modules/filter.js';
import {Utility} from '../modules/utility.js';

Api.token = sessionStorage.getItem('token', Api.token);

if (!Api.token) {
  location.replace('../../index.html');
}
const itensUser = await Api.getPrivate();

Template.templateDashboard(itensUser);

//---------- Filtro pela barra de pesquisa--------------------------------

const searchBar = document.getElementsByClassName('input-search')[0];

searchBar.addEventListener('keyup', e => {
  const searchString = e.target.value.toLowerCase();
  const filteredProducts = itensUser.filter(products => {
    return (
      products.nome.toLowerCase().includes(searchString) ||
      products.categoria.toLowerCase().includes(searchString)
    );
  });
  Filter.showFilteredDashboard(filteredProducts);
});

//-------------------------------- Profile Hover
const main = document.getElementById('main');
const containerBtnProfile = document.querySelector('.btn-profile-container');

const divLinks = document.querySelector('.div-links');

containerBtnProfile.addEventListener('mouseover', () => {
  divLinks.classList.remove('display-none');
});

containerBtnProfile.addEventListener('mouseleave', () => {
  divLinks.classList.add('display-none');
});

//------------------------------- Btn Add product

const btnAddProduct = document.getElementById('add-product');
const addProduct = document.getElementById('popup-novoProduto');
const closeAddProduct = document.getElementById('close-novoProduto');

btnAddProduct.addEventListener('click', () => {
  addProduct.classList.remove('display-none');
  main.classList.add('bg-dark');
});
closeAddProduct.addEventListener('click', () => {
  addProduct.classList.add('display-none');
  main.classList.remove('bg-dark');
});

//------------------------- Excluir produto
const deletePopup = document.getElementById('delete-popup');
const closeDelete = document.getElementById('close-delete');

closeDelete.addEventListener('click', () => {
  deletePopup.classList.add('display-none');
  main.classList.remove('bg-dark');
});

//---------- filtro por categoria --------------------------------

const categoryButtons = document.querySelectorAll('.filter');

function removeSelected() {
  categoryButtons.forEach(button => button.classList.remove('selected'));
}

function filterByCategory(targetId) {
  if (targetId == 'todos') {
    Template.templateDashboard(itensUser);
    editar();
  } else {
    const filteredArr = Filter.filterByInput(targetId, itensUser);
    Template.templateDashboard(filteredArr);
    editar();
  }
}

categoryButtons.forEach(btn => {
  btn.addEventListener('click', event => {
    removeSelected();
    event.currentTarget.classList.add('selected');
    const filter = event.currentTarget.id;
    filterByCategory(filter);
  });
});

//------------------------- Editar produto => dentro de uma funcao e dps direto na renderizacao
const editarPopup = document.getElementById('popup-editar');
const closeEditar = document.getElementById('close-editar');

closeEditar.addEventListener('click', () => {
  editarPopup.classList.add('display-none');
});

//------------------------- editar um produto

editar();

function editar() {
  const popupEditar = document.getElementById('popup-editar');
  const popupInputs = document.getElementsByClassName('form-input');
  const inputCategory = document.getElementById('select-form-editar');
  const confirmEdit = document.getElementById('editar');
  const editButton = document.getElementsByClassName('fa-solid fa-pen');

  for (let i = 0; i < editButton.length; i++) {
    editButton[i].addEventListener('click', () => {
      popupEditar.classList.remove('display-none');
      main.classList.add('bg-dark');
      closeEditar.addEventListener('click', () => main.classList.remove('bg-dark'));

      popupInputs[5].value = itensUser[i].nome;
      inputCategory.value = itensUser[i].categoria;
      popupInputs[6].value = itensUser[i].descricao;
      popupInputs[7].value = itensUser[i].preco;
      popupInputs[8].value = itensUser[i].imagem;

      confirmEdit.addEventListener('click', async e => {
        e.preventDefault();

        const productNewInfos = {
          nome: popupInputs[5].value,
          descricao: popupInputs[6].value,
          categoria: inputCategory.value,
          preco: popupInputs[7].value,
          imagem: popupInputs[8].value,
        };
        const returnApi = await Api.editProduct(productNewInfos, itensUser[i].id);

        if (returnApi === 'Produto Atualizado') {
          Utility.alertShow('Produto atualizado com sucesso');
          const okBtn = document.getElementById('alert-ok');

          okBtn.addEventListener('click', e => {
            location.reload();
          });
        } else if (returnApi == 'Validation error: Campo nome deve ter entre 4 a 150 caracteres') {
          Utility.alertShow('Error, Campo de nome deve ter entre 4 a 150 caracter');
        } else if (
          returnApi == 'Validation error: Campo descricao não pode ser vazio' ||
          returnApi.error ==
            'preco must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
        ) {
          Utility.alertShow('Nenhum Campo pode ser vazio!');
        } else if (
          returnApi == 'Validation error: Campo descricao não pode ultrapassar 500 caracteres'
        ) {
          Utility.alertShow('a descrição deve conter letras!');
        } else if (returnApi.error == 'Formato de imagem invalido, deve ser uma url') {
          Utility.alertShow('a Imagem deve ser uma Url');
        }
      });
    });
  }
}

//--------------------------------- Register Product
class RegisterProduct {
  static registerProduct() {
    const submit = document.querySelector('.form');
    submit.addEventListener('submit', event => {
      event.preventDefault();
      let formRegister = [...document.querySelectorAll('.form-input')].reduce(
        (acc, cur) => ({...acc, [cur.name]: cur.value}),
        {}
      );

      Api.createProduct(formRegister).then(res =>
        res.msg
          ? Utility.alertShow(res.msg)
          : res.error
          ? Utility.alertShow(res.error)
          : location.reload()
      );
    });
  }
}
RegisterProduct.registerProduct();
//------------------------------------------------------------------
