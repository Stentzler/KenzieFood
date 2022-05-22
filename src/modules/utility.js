export class Utility {
  //Alerta popup---------------------

  static alertShow(text = 'error') {
    const alertContainer = document.getElementById('alert');
    const alertText = document.getElementById('text-alert');
    const closeAlert = document.getElementById('close-alert');
    const okBtn = document.getElementById('alert-ok');
    alertText.innerText = text;
    alertContainer.classList.remove('display-none');

    closeAlert.addEventListener('click', event => {
      event.preventDefault();
      alertContainer.classList.add('display-none');
    });

    okBtn.addEventListener('click', event => {
      event.preventDefault();
      alertContainer.classList.add('display-none');
    });
  }
}
