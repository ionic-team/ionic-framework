# Templários (Design System)

> 21 de Maio de 2021

## VISÃO Planejamento DS

A proposta geral do Design System é não apenas criar uma identidade visual unificada, como facilitar a implementação e criação de novas telas. Utilizando como base o **stencil** e o **ionic-framework**, conseguimos com facilidade e de forma ágil criar nossos componentes. E com o **storybook** documentar os componentes de forma fácil para a utilização dos times.

## OBJETIVOS
Padronizar a identidade visual dos produtos do medgrupo
Centralizar componentes agnósticos que serão consumidos pelas aplicações do medgrupo.

## NECESSIDADES 
Ser de fácil consumo para todos os desenvolvedores, de back-end ao front-end.

## DECISÕES TÉCNICAS

Optou-se pelo uso de um **fork do ionic**, pois esse diminuiria a complexidade e o tempo de construção dos componentes, pois haveria a possibilidade de utilização da lógica e estrutura  já implementada pelo ionic.

## RESTRIÇÕES TÉCNICAS

### Compatibilidade 
Hoje ainda temos problemas de compatibilidade com versões antigas do ionic (Ex: Ionic 1) pois elas geram sobre-escritas de estilos que quebram os nossos componentes. 

### Testes
Temos a premissa de que vamos usar sempre a versão mais atual do ionic para mantermos nossa flexibilidade e compatibilidade, porém é previsível que existem regressões, pois o ionic pode mudar sua implementação e com isso, temos que fazer testes manuais para garantir que não temos regressões visuais, e caso hajam, serem resolvidas.

## ATRIBUTOS DE CONFIABILIDADE
Manutenibilidade > Confiabilidade > Qualidade > Segurança

## LINKS

- **[STORYBOOK](http://desenv.ordomederi.com/med-components/?path=/story/general-welcome--page)** 
- **[MED-COMPONENTS](https://github.com/MEDGRUPOGIT/med-components)**
- **[IONIC-FRAMEWORK FORK](https://github.com/MEDGRUPOGIT/ionic-framework)**
