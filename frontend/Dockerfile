# On utilise directement une image Nginx ultra-légère
FROM nginx:alpine

# Copie de la configuration Nginx (pour gérer le routage Angular SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# On copie DIRECTEMENT les fichiers déjà compilés par l'agent Node.js de Jenkins
# Angular 17+ place les fichiers dans le dossier "browser" de dist
COPY dist/agricultural-marketplace/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
