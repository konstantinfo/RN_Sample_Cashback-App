import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoreItem from './StoreItem';

// tslint:disable:max-line-length
const stores = [
  {
    active: true,
    amount: 3,
    description: 'В книжном интернет-магазине "Лабиринт" можно купить не только книги, но и фильмы, музыку, софт, игрушки и многое другое. Заказы доставляются в любую точку мира. Курьерская служба "Лабиринта" действует в 301 городе и населенном пункте России. Во многих из них есть пункты самовывоза. <p><p>\r\n<p><h3>Внимание!</h3>\r\n<p>Чтобы получить кэшбэк в магазине Лабиринт, просим вас сообщить данные о покупке в Службу поддержки, иначе мы не сможем правильно рассчитать кэшбэк.\r\n<p><h3><a class="labirint-modal" data-toggle="modal" data-target="#labirint-modal" style="cursor: pointer; color:#62d6ef;" >Сообщить о заказе</a></h3>\r\n\r\n\r\n         ',
    id: '10930',
    image: { uri: 'https://s3.eu-central-1.amazonaws.com/bonusbay-images/qa/campaign_banner/a1468a0a9aa209980d4b49e640892434.png' },
    isBoosted: false,
    offers: false,
    onPress: () => undefined,
    originalAmount: 3,
    promocodes: false,
    rating: '',
    title: 'Лабиринт',
    unit: '%',
  },
  {
    active: true,
    amount: 12.9,
    description: '<p>AliExpress – популярный в России китайский гипермаркет товаров: можно купить одежду, аксессуары, обувь, гаджеты, косметику, игрушки, бижутерию, посуду, товары для дома. В Копикот.ру представлены купоны Алиэкспресс, распродажи и актуальные скидки на товары.\r\n<p>Вы можете получить <b>дополнительный кэшбэк</b> на банковскую карту, подробнее здесь: <a href="https://www.kopikot.ru/tinkoffaliexpress"> Тинькофф Aliexpress</a>\r\n<p><strong>Особенности магазина:</strong>\r\n<p><li>После закрытия браузера информация о клике через Копикот.ру стирается.</li>\r\n<p><li>Оформление и оплату заказа необходимо производить<strong> в течение часа после перехода в магазин через Копикот.ру</strong>.</li>\r\n<p><li>При начислении кэшбэка в Aliexpress могут быть <strong>небольшие расхождения в суммах,</strong> т.к. бонус начисляется в долларах и конвертируется по актуальному курсу рубля. В течение суток сумма бонуса изменится на актуальную.</li>\r\n<p><li>Если сумма кэшбэка с покупки составляет <strong>менее одного цента,</strong> то бонус может поступить на счет вашего профиля в размере 0 руб.</li>\r\n<p><li>Чтобы кэшбэк быстрее был одобрен, нужно <strong>подтвердить получение посылки </strong>в личном кабинете.</li>\r\n<p><li>Алиэкспресс зачисляет бонусы<strong> в течение 30-40 дней с момента подтверждения получения вами покупки,</strong>  т.к. только в данном случае продавец получает средства за товар.</li>\r\n<p> <li>За покупки из раздела <strong>"МОЛЛ", сертификаты, купоны, скидки на услуги, оплату мобильной связи,  </strong> кэшбэк не начисляется.</li>\r\n<p>Если у Вас возникли вопросы о получении кэшбэка из Aliexpress, пожалуйста, обратитесь в Службу поддержки Копикот.ру по адресу <a href="mailto:help@kopikot.ru">help@kopikot.ru</a>.',
    id: '11240',
    image: { uri: 'https://s3.eu-central-1.amazonaws.com/bonusbay-images/qa/campaign_banner/394fb888dc77966067623bac86f15d85.png' },
    isBoosted: true,
    offers: true,
    onPress: () => undefined,
    originalAmount: 4.9,
    promocodes: false,
    rating: '',
    title: 'AliExpress',
    unit: '%',
  },
];
// tslint:enable:max-line-length

storiesOf('StoreItem', module)
  .add('Default', () => <StoreItem {...stores[0]} />)
  .add('Boosted', () => <StoreItem {...stores[1]} />);
