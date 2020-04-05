import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#E83A63',
        secondary: '#FF819E',
        bgLight: '#F2F8FF',
        gray: '#CCCCCC'
      }
    }
  }
});
