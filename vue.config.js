const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    devServer: {
      proxy: {
        '^/api/user/profile': {
          // target: 'http://localhost:8200',
          target: 'http://topology.le5le.dev.com',
          // target: 'http://topology.le5le.com',
          changeOrigin: true
        },
        '^/api/image': {
          // target: 'http://localhost:8201',
          target: 'http://topology.le5le.dev.com',
          // target: 'http://topology.le5le.com',
          changeOrigin: true
        },
        '^/api': {
          // target: 'http://localhost:8210',
          target: 'http://topology.le5le.dev.com',
          // target: 'http://topology.le5le.com',
          changeOrigin: true
        },
        '^/image': {
          // target: 'http://localhost:8201',
          target: 'http://topology.le5le.dev.com',
          // target: 'http://topology.le5le.com',
          changeOrigin: true
        }
      }
    },
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip', // 使用gzip压缩
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
        minRatio: 1, // 压缩率小于1才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      })
    ]
  }
};
