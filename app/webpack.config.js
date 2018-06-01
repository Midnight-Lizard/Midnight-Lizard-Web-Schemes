const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const isTest = process.env.NODE_ENV === 'test';
    const clientBundleOutputDir = './wwwroot/dist';
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                isDevBuild
                    ? { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] }
                    : {
                        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                        include: /ClientApp/,
                        loader: '@ngtools/webpack'
                    },
                {
                    test: /\.html$/, use: [{
                        loader: 'html-loader', options: {
                            "minimize": !isDevBuild,
                            "removeComments": true,
                            "removeCommentsFromCDATA": true,
                            "removeCDATASectionsFromCDATA": false,
                            "collapseWhitespace": true,
                            "conservativeCollapse": true,
                            "removeAttributeQuotes": false,
                            "useShortDoctype": false,
                            "keepClosingSlash": true,
                            "minifyJS": false,
                            "minifyCSS": false,
                            "removeScriptTypeAttributes": false,
                            "removeStyleTypeAttributes": false,
                            "caseSensitive": true,
                            "customAttrSurround": [[/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/]],
                            "customAttrAssign": [/\)?\]?=/]
                        }
                    }]
                },
                { test: /\.css$/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: ['raw-loader', isDevBuild ? 'sass-loader' : 'sass-loader?minimize'] // sass-loader
                }
            ]
        },
        plugins: [
            new CheckerPlugin()
        ].concat(isDevBuild
            ? // Plugins that apply in development builds only
            [
                new webpack.SourceMapDevToolPlugin({
                    filename: isTest ? null : '[file].map',
                    test: /\.(ts|js)($|\?)/i,
                    moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]')
                })
            ] : [// Plugins that apply in production builds only
                // new webpack.optimize.UglifyJsPlugin({
                //     comments: false,
                //     sourceMap: isDevBuild || isTest,
                //     output: {
                //         ascii_only: true,
                //         comments: false,
                //         beautify: false
                //     },
                //     uglifyOptions: {
                //         ie8: false,
                //         mangle: {
                //             safari10: true,
                //         },
                //         output: {
                //             ascii_only: true,
                //             comments: false,
                //             beautify: false,
                //             webkit: true,
                //         }
                //     }
                // })
            ])
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleConfig = merge(sharedConfig, {
        entry: {
            'main-client': './ClientApp/boot-client.ts'
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir)
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [] : [
            new AngularCompilerPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: path.join(__dirname, 'ClientApp/app/app.module.client#AppModule'),
                exclude: ['./**/*.server.ts']
            }),
            new webpack.optimize.UglifyJsPlugin({
                output: {
                    ascii_only: true,
                }
            })])
    });

    const schemesClientBundleConfig = merge(sharedConfig, {
        entry: {
            'schemes-module-client': './ClientApp/schemes/schemes.client-module.ts'
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir),
            libraryTarget: 'commonjs'
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [] : [
            new AngularCompilerPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: path.join(__dirname, 'ClientApp/schemes/schemes.client-module#SchemesClientModule'),
                exclude: ['./**/*.server.ts']
            }),
            new webpack.optimize.UglifyJsPlugin({
                output: {
                    ascii_only: true,
                }
            })])
    });

    const serverBundleConfig = merge(sharedConfig, {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': './ClientApp/boot-server.ts' },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: false,
                output: {
                    ascii_only: true
                }
            }),
            new AngularCompilerPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: path.join(__dirname, 'ClientApp/app/app.module.server#AppModule'),
                exclude: ['./**/*.client.ts']
            })]),
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        devtool: isDevBuild || isTest ? 'inline-source-map' : false
    });

    const schemesServerBundleConfig = merge(sharedConfig, {
        resolve: { mainFields: ['main'] },
        entry: { 'schemes-module-server': './ClientApp/schemes/schemes.server-module.ts' },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: false,
                output: {
                    ascii_only: true,
                }
            }),
            new AngularCompilerPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: path.join(__dirname, 'ClientApp/schemes/schemes.server-module#SchemesServerModule'),
                exclude: ['./**/*.client.ts']
            })]),
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, clientBundleOutputDir)
        },
        target: 'node',
        devtool: isDevBuild || isTest ? 'inline-source-map' : false
    });

    return [clientBundleConfig, serverBundleConfig, schemesClientBundleConfig, schemesServerBundleConfig];
};
