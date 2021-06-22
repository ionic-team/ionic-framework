# ADR Design System

## Status
Aceito

## Context
Devido a algumas restrições técnicas não é possível dar total suporte aos web-components no contexto ionic-1

### Restrições técnicas
O framework ionic renderiza algumas classes de estilização no host element. 

Por estarmos utilizando ambos ionic 1 e 5 na mesma aplicação, os estilos do ionic 1 acabam sobrescrevendo os do ionic 5. 

Sendo assim sua sobrescrita se torna impossível no contexto ionic 1.

## Decision
Foi decidido não gastar tempo tentando dar suporte aos componentes no contexto ionic 1, pois o mesmo será migrado para o ionic 5 mediante priorização.

## Consequences
Quando for necessário uma alteração no código legado, o mesmo deve ser feito da forma tradicional, dentro da folha de estilo da própria página.
