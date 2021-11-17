<template>
  <div class="home">
    <!-- 使用topology组件 -->
    <topology
      :configs="topologyConfigs"
      :materials="materials"
      :user="user"
      :data="data"
      @event="onEvent"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// 导入topology-vue组件
import topology from 'topology-vue';
// 需要导入topology-vue.css
import 'topology-vue/topology-vue.css';

import {
  defalutMaterials,
  defalutMaterialTabs,
  iconMenus,
  userMenus,
} from './data';
import { register } from '../components/myShape';
import axios from 'axios';

Vue.use(topology);

declare const window: any;

@Component({})
export default class Home extends Vue {
  topologyConfigs = {
    license: {
      key: 'key',
      value: 'value',
      version: 'version',
    },
    logo: {
      img: 'http://topology.le5le.com/img/favicon.ico',
      url: 'http://topology.le5le.com',
      target: '_blank',
      text: 'le5le',
    },
    menus: iconMenus,
    loginUrl: 'https://account.le5le.com',
    signupUrl: 'https://account.le5le.com',
    userMenus: userMenus,
    materialTabs: defalutMaterialTabs,
    // 若为 undefined 与不传时，使用默认的 cdn 显示
    // monaco: undefined,
    // 使用 public 下的 本地 monaco
    monaco: '/assets/monaco-editor',
    dataOptionsFn: (pen: any, key: string, value: string) => {
      const keys = ['aaa', 'bbb'];
      const values = [
        {
          value: 111,
          label: '111',
        },
        {
          value: 222,
          label: '222',
        },
      ];
      return {
        keys,
        // value: 80,
        values,
      };
    },
  };

  user: any = {
    username: 'le5le',
  };

  materials = {
    system: defalutMaterials,
    iconUrls: ['http://at.alicdn.com/t/font_1331132_g7tv7fmj6c9.css'],
    uploadUrl: '/api/file',
    uploadHeaders: {
      Authorization: 'your token',
    },
    uploadParams: {
      mydata: 1,
    },
  };

  data: any = {
    websocket: '',
    mqttUrl: '',
    component: !!this.$route.query.component,
  };

  created() {
    // 注册图形库
    this.registerBuiness();
    const data = (window as any).topologyData;
    // 预览页返回，存在缓存数据
    if (data) {
      this.data = Object.assign({}, data);
      setTimeout(() => {
        (window as any).topologyData = null;
      }, 200);
    } else {
    }
  }
  group(arr: any[], key: string) {
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = arr[i];
      if (!map[ai[key]]) {
        dest.push({
          key: ai[key],
          data: [ai],
        });
        map[ai[key]] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.key == ai[key]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  }
  async registerBuiness() {
    if (window.registerTools) {
      window.registerTools();
    }
    if (window.topologyTools) {
      let list = this.group(window.topologyTools, 'class');
      this.materials.system.push(...list.map((el) => {
        return {
          name: el.key,
          expand: false,
          show: true,
          list: el.data,
        };
      }));
    }
    if (window.registerIot) {
      window.registerIot(this.topologyConfigs.license);
    }
    this.materials.system.push({
      iconUrl: '//at.alicdn.com/t/font_2366205_nnqrrnc9mta.css', // 替换成真实的地址
      show: true,
      list: [], // 此处留空数组就好，会自动填充
    });
    register();
    // 注册后 push 到数组中
    this.materials.system.push({
      name: '自定义图形库',
      expand: false,
      show: true,
      list: [
        {
          name: 'thermometer',
          icon: 't-icon t-wenduji',
          data: {
            rect: {
              width: 100,
              height: 400,
            },
            name: 'thermometer',
          },
        },
      ],
    });
    // 图片引入
    const res = await getSvgUrl('/img'); // 替换成实际上的 svg 存放地址
    const svgList = res.map((svg: any) => {
      return {
        image: svg,
      };
    });
    this.materials.system.push({
      name: 'svg 图形库',
      expand: false,
      show: true,
      list: svgList,
    });
  }

  onEvent(e: { name: string; params: any }) {
    switch (e.name) {
      case 'logout':
        // 退出登录
        this.user = null;
        // Do sth.
        break;

      case 'openMaterialGroup':
        // 展开/折叠图标工具栏分组
        console.log('openMaterialGroup', e.params);
        // Do sth.
        break;

      case 'addMaterial':
        // 添加“我的组件”
        // Do sth. For example:
        this.$router.push({
          path: '/',
          query: { component: '1' },
        });
        break;

      case 'editMaterial':
        // 编辑“我的组件”
        // Do sth. For example:
        this.$router.push({
          path: '/',
          query: { id: e.params.id, component: '1' },
        });
        break;

      case 'open':
        // 导航菜单configs.menus里面定义的action
        // 比如这里表示打开文件
        break;
      case 'save':
        // 导航菜单configs.menus里面定义的action
        // 比如这里表示保存文件
        break;
      case 'addImageUrl':
        // 在“我的图片”里面添加了一张新图片
        // this.addImageUrl(e.params);
        break;
      case 'deleteImage':
        // 在“我的图片”里面删除了一张图片
        // this.deleteImage(e.params);
        break;
      case 'preview':
        // 点击工具栏“预览”

        // 保存当前编辑数据，方便预览时直接打开
        (window as any).topologyData = (window as any).topology.data;
        this.$router.push({
          path: '/preview',
          query: { id: 'xxx', r: '1' },
        });
        break;

      // ...
      // ...
    }
  }
}

/**
 * 获取文件夹路径下的所有文件
 * @param rootUrl 根路径
 */
async function getSvgUrl(rootUrl: string) {
  const { data } = await axios.get(rootUrl);
  const result: string[] = [];
  for (const sonUrl of data) {
    if (sonUrl.includes('.')) {
      // 包含点的认为是图片 TODO: 判断较粗糙，只适用于通常情况
      result.push(rootUrl + '/' + sonUrl);
    } else {
      // 不包含点认为是 文件夹
      result.push(...(await getSvgUrl(rootUrl + '/' + sonUrl)));
    }
  }
  return result;
}
</script>
<style lang="scss">
.home {
  height: 100vh;
}
</style>
