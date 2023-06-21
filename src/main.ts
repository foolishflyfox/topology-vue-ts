import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  render: (h) => h(App),  // 渲染 App 组件
}).$mount('#app');  // 将 App 组件挂载在 #app 上
