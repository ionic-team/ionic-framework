## Fluxos GIT

### Branch Semanal

- mergear branch da sprint anterior(ds-week-30) com squash com a `release`.
- criar `release` com a `master` sem squash.
- criar branch da sprint atual(ds-week-31) apartir da `release`.

## Desenvolvimento

```bash
npm run custom:start
```

```bash
npm run custom:storybook
```

## Produção

```bash
npm run custom:build
```

```bash
npm run custom:build:storybook
```

## Importante

- para estilização de um componente ionic utilizar como referência o componente `ion-badge`.
- para que o live reload funcione com o ionic é necessário que o scss seja construido nos arquivos md ou ios.