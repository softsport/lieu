// import Lieu from 'lieu';

// const lieu = new Lieu({
//     initialLanguage: "ru", // not required - если не указываем то выбор происходит автоматически
//     attributeName: "data-localize", // not required - значение по умолчанию
//     langauges: {
//         ru: {
//             name: "Русский",
//             locales: {
//                 "Hello": "Привет!",
//             }
//         },
//         en: {},
//     },
//     onSetLang: (newLang, oldLang) => {}, // not required
//     onGetLang: () => {} // not required
// })

// lieu.setLang("ru") // устанавливаем текущий язык
// lieu.getLang("ru") // not required - если не указываем то получаем объект текущего языка
// lieu.getBrowserLang() // получаем navigator.language

// lieu.localize("Hello") // получаем перевод по ключу из текущего объекта языка
// lieu.__("Hello") // Привет!
import Lieu from './core';

export default Lieu;
