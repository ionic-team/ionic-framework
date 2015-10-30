import {NavController, Page} from 'ionic/ionic';

<% _.forEach(tabs, function(tab) { %>
import {<%= tab.javascriptClassName %>} from '../<%= tab.fileAndClassName %>/<%= tab.fileAndClassName %>';
<% }); %>

@Page({
  templateUrl: 'app/<%= fileAndClassName %>/<%= fileAndClassName %>.html'
})
export class <%= javascriptClassName %> {
  constructor(nav: NavController) {
    // set the root pages for each tab
    <% _.forEach(tabs, function(tab) { %>
    this.<%= tab.javascriptClassName %> = <%= tab.javascriptClassName %>;
    <% }); %>
  }

}
