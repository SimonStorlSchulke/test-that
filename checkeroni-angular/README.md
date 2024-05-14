## **checkeroni** zu angular projekt hinzufügen:

### angular.json

```json
{
//...
      "architect": {
        "build": {
          "configurations": {
            "production": {
              //...
            },

            "testing": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true,
              "tsConfig": "tsconfig.test.json",
              "styles": [],
              "fileReplacements": [
                {
                  "replace": "src/main.ts",
                  "with": "src/main.test.ts"
                }
              ]
            }
```


### teconfig.test.json:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/test",
  },
  "include": [
    "src/**/*.test.ts",
    "src/**/*.d.ts"
  ]
}

```

start with
ng serve --configuration=testing --port 4201