import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
<% _.forEach(tabs, function(tab) { %>import { <%= tab.jsClassName %> } from '../<%= tab.fileName %>/<%= tab.fileName %>';
<% }); %>

@Component({
  templateUrl: 'build/<%= directory %>/<%= fileName %>/<%= fileName %>.html'
})
export class <%= jsClassName %> {

  constructor(public navCtrl: NavController) {
    // set the root pages for each tab
    <% _.forEach(tabs, function(tab, i) { %>this.tab<%= ++i %>Root = <%= tab.jsClassName %>;
    <% }); %>
  }
}
