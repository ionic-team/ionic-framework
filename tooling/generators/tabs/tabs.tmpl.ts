import {NavController, Page} from 'ionic-angular';
<% _.forEach(tabs, function(tab) { %>import {<%= tab.jsClassName %>} from '../<%= tab.fileName %>/<%= tab.fileName %>';
<% }); %>

@Page({
  templateUrl: 'build/<%= directory %>/<%= fileName %>/<%= fileName %>.html'
})
export class <%= jsClassName %> {

  constructor(public nav: NavController) {
    // set the root pages for each tab
    <% _.forEach(tabs, function(tab, i) { %>this.tab<%= ++i %>Root = <%= tab.jsClassName %>;
    <% }); %>
  }
}
