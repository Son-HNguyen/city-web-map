# CityWebMap

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

## Run using Docker

Pull the image:
```bash
docker pull sonnguyentum/city-web-map:latest
```

Start the container (here to publish via port 3001 at host):
```bash
docker run -dit \
       --name city-web-map \
       -p 3001:3001 \
       sonnguyentum/city-web-map:latest
```

The web client is now available using the URL:

http://localhost:3001

## Run using NodeJS

Build the project:
```bash
ng build --configuration production
```
The build will be stored by default 
in the directory [dist/city-web-map](dist/city-web-map).
Then run the server:
```bash
node server.js
```

## Development server

For development:
```bash
ng serve --configuration developmenet
``` 
For production:
```bash
ng serve --configuration production
# or ng serve by default
``` 

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
