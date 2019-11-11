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
      exports: 'named',
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
          vue: 'Vue'
        },
      }),
      outputConfig('.esm', 'esm'),
      outputConfig('.common', 'cjs'),
    ],
    external: [
      'vue',
      'vue-router',
      '@ionic/core',
      '@ionic/core/loader',
      'ionicons',
      'ionicons/icons',
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
