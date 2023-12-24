import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        strictPort: true,
    },
    build: {
        commonjsOptions: {
            ignore: ['os', 'child_process', 'worker_threads'],
        },
    },
});
