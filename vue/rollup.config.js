import path from 'path'
import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const resolve = _path => path.resolve(__dirname, './', _path)

function outputConfig(suffix, format, opts = {}) {
  return Object.assign(
    {
      file: resolve(`./dist/ionic-vue${suffix}.js`),
      name: 'IonicVue',
      sourcemap: true,
      format,
    },
    opts
  )
}

function baseConfig() {
  return {
    input: resolve('./src/index.ts'),
    output: [
      outputConfig('', 'umd', {
        globals: {
          vue: 'Vue',
          'vue-class-component': 'VueClassComponent',
          'vue-property-decorator': 'vue-property-decorator',
        },
      }),
      outputConfig('.esm', 'esm'),
      outputConfig('.common', 'cjs'),
    ],
    external: [
      'vue',
      'vue-router',
      'vue-class-component',
      'vue-property-decorator',
      '@ionic/core/loader',
      '@ionic/core/css/ionic.bundle.css',
      '@ionic/core/dist/ionic/svg',
      'ionicons/dist/collection/icon/icon.css',
    ],
    plugins: [
      vue(),
      typescript({
        useTsconfigDeclarationDir: true,
        objectHashIgnoreUnknownHack: true,
        clean: true
      })
    ],
  }
}

export default args => {
  const configs = [baseConfig()]

  if (args.configProd === true) {
    const prodConfig = baseConfig()
    prodConfig.plugins.push(terser())

    for (const item of prodConfig.output) {
      item.file = item.file.replace('.js', '.min.js')
      item.sourcemap = false
    }

    configs.push(prodConfig)
  }

  return configs
}
