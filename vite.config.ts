import {TanStackRouterVite} from "@tanstack/router-vite-plugin"
import react from "@vitejs/plugin-react-swc"
import {defineConfig} from "vite"
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'), // This sets up the alias
        },
    },
    server: {
    },
    preview: {
        host: '0.0.0.0',
        port: 3000
    }
})
