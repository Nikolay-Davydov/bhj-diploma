/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

// const { application } = require("express");

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Элемена нет в AccountsWidget');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
   registerEvents() {
    const createAccount = this.element.querySelector('.create-account');

    createAccount.onclick = () => App.getModal('createAccount').open();

    const clickHandler = (event) => {
      const target = event.target.closest('.account');

      if (target) {
        this.onSelectAccount(target);
      }
    }

    this.element.addEventListener('click', clickHandler);
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response) {
          this.clear();

          for (let i = 0; i < response.data.length; i++) {
            this.renderItem(response.data[i]);
          }
        } 
        else {
          console.log(`Ошибка ${err}`);
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const allAccounts = document.querySelectorAll('.account');
    for (let account of allAccounts) {
      account.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const activeAccount = this.element.querySelector('.account.active');

    activeAccount?.classList.remove('active');

    element.classList.add('active');

    const accountName = element.querySelector('span').textContent;

    const callback = (error, response) => {
      if (error) {
        handleError(error);
      } else {
        const accountId = response.data.find(account => {
          return account.name === accountName;
        }).id;
        App.showPage('transactions', {account_id: accountId});
      }
    }
    Account.list(User.current(), callback);
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `
    <li class="account" data-id="${item.id}">
      <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} ₽</span>
      </a>
    </li>
  `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    let elemAccount = this.getAccountHTML(data);
    this.element.insertAdjacentHTML('beforeEnd', elemAccount);
  }
}
