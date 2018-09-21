// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Goods from './Goods'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      path: '/goods',
      component: {
        template: `<div>这是商品主页的子页面</div>`
      }
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { Goods },
  template: '<Goods/>'
})
