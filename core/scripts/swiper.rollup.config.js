import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/components/slides/swiper/swiper.js',
  output: {
    file: 'src/components/slides/swiper/swiper.bundle.js',
    format: 'es'
  },
  plugins: [
    resolve()
  ]
};