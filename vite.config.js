import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
const base = '/optc-box-manager/';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg'],
            manifest: {
                name: 'OPTC Box Manager',
                short_name: 'OPTC Box',
                description: 'Gestiona tu box de One Piece Treasure Cruise',
                theme_color: '#131820',
                background_color: '#0d1117',
                display: 'standalone',
                start_url: base,
                scope: base,
                lang: 'es',
                icons: [
                    {
                        src: `${base.replace(/\/$/, '')}/favicon.svg`,
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2}'],
            },
        }),
    ],
    base,
});
