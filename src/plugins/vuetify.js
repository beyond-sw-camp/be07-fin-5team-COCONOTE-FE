import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';
// Pretendard 폰트 추가
import 'pretendard/dist/web/static/pretendard.css';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
        },
        variables: {},
        typography: {
          fontFamily: 'Pretendard, sans-serif',
        },
      },
    },
  },
});
