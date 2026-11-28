import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function serveLandingPage(server) {
  server.middlewares.use((request, response, next) => {
    const pathname = request.url?.split('?')[0]
    if (pathname === '/landing.html') {
      response.writeHead(302, { Location: request.url.replace('/landing.html', '/') })
      response.end()
      return
    }
    if (pathname === '/') {
      request.url = request.url.replace('/', '/landing.html')
    }
    next()
  })
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'public-landing-page',
      configureServer: serveLandingPage,
      configurePreviewServer: serveLandingPage,
    },
  ],
  build: { rollupOptions: { input: ['index.html', 'landing.html'] } },
})
