import { ref, watch } from 'vue';
import Lieu from 'lieu';

export default {
    install: (app, options) => {
        const lang = ref(null);

        const lieu = new Lieu({
            ...options,
            onSetLang(newLang) {
                lang.value = newLang;
            },
        });

        app.config.globalProperties.$lieu = lieu;
        app.provide('lieu', lieu);

        app.directive('lieu', (el, binding) => {
            el.innerText = lieu.trans(binding.value);

            watch(lang, () => {
                el.innerText = lieu.trans(binding.value);
            });
        });
    },
};
