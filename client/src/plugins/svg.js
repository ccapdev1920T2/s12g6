import { SVG } from "@svgdotjs/svg.js";

export default {
  install(Vue) {
    Vue.prototype.$svg = SVG;
  }
};
