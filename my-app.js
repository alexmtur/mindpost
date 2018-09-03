import {OneClass, html} from '@alexmtur/one-class'
// import {OneIcon} from '@alexmtur/one-icon/one-icon.js'

export class MyApp extends OneClass {
    static get properties() {return {
        user: Object,
        email: String,
        password: String
        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  
        /* Think about the url structure for the app 
        /home
        /username: my users home (in datablase is users/username)
            *should settings just be a modal?
        /username/public: go to public screen
        /usernmae/settings: go to 
        /username/newEvent
        /username/event/eventid (in db is users/username/events/eventid)
        /public/event/eventid (public is also a username)
        */ 
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            this.user = user;
            this.username = user.displayName;
            console.log(email);
            // ...
          } else {
            // User is signed out.
            // ...
          }
        });
    }
    createUser() {
        console.log(this.email);
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error);
          // ...
        });

    }
     _render() {return html`
        <style>
            :host {
                display: block;
                /*position: absolute;*/
                top: 0;
                left: 0;
                z-index: 100;
            }            
        </style>
        <h1>
            Welcome to Mindpost!
        </h1>
        <input on-change=${(e)=>{this.email = e.target.value}} type="email">
        <input on-change=${(e)=>{this.password = e.target.value}} type="password">
        <button on-click=${(e)=>{this.createUser()}}>Create user</button>
        <user-home username=${this.email} activeUrl=${'/'+this.email}></user-home>


        `;
    }
   
}
customElements.define('my-app', MyApp);

export class UserHome extends OneClass {
    static get properties() {return {
        username: String,
        password: String
        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  
    }
     _render() {return html`
        <h2>
            Welcome ${this.user}
        </h2>
        `;
    }
}
customElements.define('user-home', UserHome);
