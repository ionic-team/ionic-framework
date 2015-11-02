import {NavController, Page} from 'ionic/ionic';

<% _.forEach(tabs, function(tab) { %>import {<%= tab.jsClassName %>} from '../<%= tab.fileName %>/<%= tab.fileName %>';
<% }); %>
@Page({
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html'
})
export class <%= jsClassName %> {
  constructor(nav: NavController) {
    // set the root pages for each tab
    <% _.forEach(tabs, function(tab) { %>this.<%= tab.fileName %> = <%= tab.jsClassName %>;
    <% }); %>
  }

}
