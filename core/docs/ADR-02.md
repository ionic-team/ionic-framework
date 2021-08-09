# ADR-02 Design System

## Status
Aceito

## Contexto
Devido a constantes alterações nas estruturas de componentes por parte do ionic, faremos a atualização da versão dos componentes de forma sasonal.

### Restrições
Esporadicamente o ionic atualiza seus componentes e costuma mudar a estrutura do mesmo, para fazer pequenas correções.

Porém nem sempre essas correções são de grande impacto para o componente, mas elas tem modificado sua estrutura e com isso gera impacto e regressão nos nossos componentes que são construidos em cima do ionic.

Isso nos atrapalha e gera impacto no tempo, pois a cada update é necessário revisitar e revisar todos os componentes para validar possíveis regressões e ajustar caso ocorram. 

Trammit desnecessário, caso nossos componentes estejam funcionando corretamente.

## Decisão
Decidimos que avaliaremos os updates majors do ionic-framework e faremos atualizações de nossos componentes de forma sasonal, no periodo de novembro a março ( precedendo os simulados e após as ultimas provas de recursos ) caso necessário.

## Consequências
Caso um update do ionic-framework traga coisas de muito valor, teremos que esperar nossa janela de atualização para ter tais upgrades.

Salvo em casos que nossos componentes se tornem obsoletos, teremos que fazer updates emergenciais. Alinhados com toda a guilda do MSPRO.
