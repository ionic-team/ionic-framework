# Fork do Ionic Framework 
Branches | Descrição
--------- | ----------
master | conteúdo "cru" do Ionic Team
Release-Branch | conteúdo alterado

### Como inserir o remote do Ionic Team

1. Abra Git Bash.
2. Liste o repositório remote configurado no momento para sua bifurcação.
    ```
    git remote -v
    origin  https://github.com/MEDGRUPOGIT/ionic-framework (fetch)
    origin  https://github.com/MEDGRUPOGIT/ionic-framework (push)
    ```
3. Especifique um novo repositório upstream remote que será sincronizado com a bifurcação.
    ```
    git remote add upstream https://github.com/ionic-team/ionic-framework
    ```
4. Verifique o novo repositório upstream especificado para a bifurcação.
    ```
    git remote -v
    > origin    https://github.com/MEDGRUPOGIT/ionic-framework (fetch)
    > origin    https://github.com/MEDGRUPOGIT/ionic-framework (push)
    > upstream  https://github.com/ionic-team/ionic-framework (fetch)
    > upstream  https://github.com/ionic-team/ionic-framework (push)
    ```

### Como atualizar a master com os últimos commits do Ionic team

1. Obtenha os branches e os respectivos commits do repositório upstream. Os commits para BRANCHNAME serão armazenados no branch local upstream/BRANCHNAME.
    ```
    git fetch upstream
    ```

2. Faça o checkout do branch padrão local da sua bifurcação (master)
    ```
    git checkout master
    > Switched to branch 'master'
    ```

3. Faça pull da master
    ```
    git pull
    ```

4. Faça merge das alterações do branch padrão upstream - nesse caso, upstream/master - no seu branch padrão local. Isso coloca o branch padrão da bifurcação em sincronia com o repositório upstream, sem perder as alterações locais. Recomenda-se usar squash
    ```
    git merge upstream/master --squash
    ```

5. Faça um commit
    ```
    git commit -m "atualização da master"
    ```

6. Faça o git push setando o upstream, caso necesário
    ```
    git push --set-upstream origin master
    ```
