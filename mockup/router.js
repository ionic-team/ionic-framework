/**
 * This is a mockup of how the new router might work.
 *
 * The goal of this is to help shape the new Angular router, or
 * figure out if we need to do our own implementation.
   
   Some design decisions we need to figure out and agree on:
    
    * Deep linking. In v1 we did a complicated nested view linking, where
      a route with a URL like /contacts/name would navigate in each sub 
      view, reconstructing a whole navigation context.
      
      I'm not convinced this is the right approach for v2. Instead, we might
      want to make it more explicit, where certain URLs can trigger a handler
      where navigation can be reconstructed by the developer, but with the
      default behavior of routes being navigated to in the root nav.
 */

// Decorators

@Route({
})
class App extends Ionic {
  constructor(nav: Navigation) {
     nav.urls({
        templateUrl: '/contacts/:contact',
        navigate: (url, params) => {
           if(params.contactId) {
              // Explicit routing
              var contactList = new ContactList();
              rootNav.push(contactList, false // whether to animate);
              var contactPage = new ContactPage(params.contactId);
              rootNav.push(contactPage);
              
              // Now the user has a 2 history navigation:
              // root -> contact list -> contact page
              //
              // But note, it was up to the developer to construct the appropriate history
           }
        }
     })
     
  }
}

@Route({
  name: 'login'
  templateUrl: '/login' // Optional
})
class LoginPage extends View {
}
