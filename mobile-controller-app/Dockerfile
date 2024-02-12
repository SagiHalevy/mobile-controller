FROM node:latest as build

COPY . /app/

WORKDIR /app

RUN npm install
RUN npm run build



FROM nginx:latest
COPY --from=build /app/dist/mobile-controller-app/browser /usr/share/nginx/html
EXPOSE 80