import {defineConfig} from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import preloadImages from "./Plugins/preloadImages";

export default defineConfig({
    publicDir: "public",
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    plugins: [
        react(),
        preloadImages({
            dir: "src/assets/static/system/**/*.{jpg,png,svg}",
            attr: {
                rel: "preload",
            }
        })
    ],
})
