/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.getModal('createAccount').close();
        App.getWidget("accounts").update();
        App.updateForms();
      } else {
        console.log(`Ошибка ${err}`);
      }
    })
  }
}