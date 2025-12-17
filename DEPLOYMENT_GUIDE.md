# 🚀 GUÍA DE DEPLOYMENT EN VERCEL

## Pasos para Deploy

### 1. Preparar el Repositorio en GitHub

\`\`\`bash
# Navegar a la carpeta del proyecto
cd D:\OneDrive\GitHub\SYNC\tienda-frontend

# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - TiendaLubbi Frontend"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/tienda-lubbi-frontend.git
git branch -M main
git push -u origin main
\`\`\`

### 2. Deploy en Vercel

#### Opción A: Desde la Web (Más Fácil)

1. Ve a [https://vercel.com](https://vercel.com)
2. Click en "Sign Up" o "Log In"
3. Conecta con tu cuenta de GitHub
4. Click en "Add New..." → "Project"
5. Selecciona tu repositorio "tienda-lubbi-frontend"
6. Vercel detectará automáticamente que es Next.js
7. **NO necesitas configurar nada más**
8. Click en "Deploy"
9. ¡Espera 2-3 minutos y listo! 🎉

#### Opción B: Con Vercel CLI

\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
\`\`\`

### 3. Verificar el Deploy

Tu sitio estará disponible en:
\`\`\`
https://tienda-lubbi-frontend-XXXXX.vercel.app
\`\`\`

## Configuración Post-Deploy

### Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Configura los registros DNS según las instrucciones

### Variables de Entorno (Ya están en el código)

El webhook URL ya está hardcodeado en el código, pero si quieres cambiarlo:

1. En Vercel: Settings → Environment Variables
2. Agrega: \`NEXT_PUBLIC_WEBHOOK_URL\`
3. Valor: Tu webhook de n8n
4. Click "Save"
5. Re-deploy el proyecto

## Actualizaciones Futuras

### Actualizar Productos

1. Reemplaza el archivo \`public/productos.csv\`
2. Commit y push:
   \`\`\`bash
   git add public/productos.csv
   git commit -m "Update products catalog"
   git push
   \`\`\`
3. Vercel desplegará automáticamente

### Actualizar Código

\`\`\`bash
# Hacer cambios en el código
# ...

# Commit y push
git add .
git commit -m "Description of changes"
git push

# Vercel despliega automáticamente
\`\`\`

## Troubleshooting

### Error: Build Failed

Verifica que \`package.json\` tenga todos los scripts:
\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
\`\`\`

### Error: CSV no se carga

Verifica que el archivo esté en \`public/productos.csv\`

### Error: Imágenes no cargan

Las imágenes de MercadoLibre están configuradas en \`next.config.js\`:
\`\`\`javascript
images: {
  domains: ['http2.mlstatic.com'],
}
\`\`\`

### Chat no responde

Verifica que el webhook URL en \`ChatWidget.tsx\` sea correcto:
\`\`\`typescript
const WEBHOOK_URL = 'https://horsepower-n8n.e5l6dk.easypanel.host/webhook/...';
\`\`\`

## Performance Tips

Vercel automáticamente:
- ✅ Optimiza imágenes
- ✅ Minifica código
- ✅ Cachea assets
- ✅ Sirve desde CDN global
- ✅ Comprime respuestas

## Monitoreo

En Vercel puedes ver:
- 📊 Analytics de visitantes
- ⚡ Performance metrics
- 🐛 Error logs
- 📈 Bandwidth usage

## Costo

- **Hobby Plan (Gratis):**
  - Deployments ilimitados
  - 100 GB bandwidth/mes
  - Dominios ilimitados
  - Funciones serverless

Perfecto para empezar! 🎉

## URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentation:** https://nextjs.org/docs
- **GitHub Repo:** Tu repositorio
- **Live Site:** Tu URL de Vercel

## Próximos Pasos

1. ✅ Deploy inicial
2. 📱 Prueba en móviles
3. 🎨 Personaliza colores si es necesario
4. 📊 Configura analytics
5. 🔒 Configura dominio HTTPS personalizado
6. 💬 Prueba el chat con clientes reales

---

¿Necesitas ayuda? Revisa los logs en Vercel Dashboard.
