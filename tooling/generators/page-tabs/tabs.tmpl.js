import {NavController, Page} from 'ionic/ionic';

<% _.forEach(tabs, function(tab) { %>
import {<%= tab.javascriptClassName %>} from '../<%= tab.filename %>/<%= tab.filename %>';
<% }); %>

@Page({
  templateUrl: 'app/<%= filename %>/<%= filename %>.html'
})
export class <%= javascriptClassName %> {
  constructor(nav: NavController) {
    // set the root pages for each tab
    <% _.forEach(tabs, function(tab) { %>
    this.<%= tab.javascriptClassName %> = <%= tab.javascriptClassName %>;
    <% }); %>
  }

}
