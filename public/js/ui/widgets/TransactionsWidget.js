/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error ('Элемент отсутствует в TransactionsWidget');
    }
    else {
      this.element = element;
      this.registerEvents();
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    let buttonCreateIncome = this.element.querySelector('.btn-success');
    let buttonCreateExpense = this.element.querySelector('.btn-danger');

    buttonCreateIncome.addEventListener('click', () => {
      App.getModal('newIncome').open();
    })

    buttonCreateExpense.addEventListener('click', () => {
      App.getModal('newExpense').open();
    })
  }
}
