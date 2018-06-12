const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir.config.assetsPath = 'theme/src';
elixir.config.publicPath = 'theme/assets';

elixir(function (mix) {

    /*
     |--------------------------------------------------------------------------
     | Build scss files
     |--------------------------------------------------------------------------
     */
    mix.sass('app.scss');

    /*
     |--------------------------------------------------------------------------
     | Build JS files
     |--------------------------------------------------------------------------
     */
    mix.webpack('app.js', 'theme/assets/js/app.js');

    /*
     |--------------------------------------------------------------------------
     | Copy fonts and other files
     |--------------------------------------------------------------------------
     */
    mix.copy([
        'node_modules/bootstrap-sass/assets/fonts'
    ], 'theme/assets/fonts');

    // mix.copy(['src/images'], 'dist/images');
});
