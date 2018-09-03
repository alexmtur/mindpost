import {OneClass, html} from '@alexmtur/one-class'
// import {OneIcon} from '@alexmtur/one-icon/one-icon.js'
//https://polymer.github.io/lit-html/guide/writing-templates.html#conditionals-ifs-and-loops

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
    googleSignIn() {
    	let provider = new firebase.auth.GoogleAuthProvider();
    	//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    	provider.addScope('https://www.googleapis.com/auth/calendar'); //manage calendars
    	firebase.auth().signInWithPopup(provider).then(function(result) {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;
		  console.log(user);
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
        <user-home username=${this.email} activeUrl=${'/'+this.email}></user-home> //sorry your usser does not exist in the plaform
        html`
		  ${user.isloggedIn
		      ? html`Welcome ${user.name}`
		      : html`Please log in`
		  }
		`;

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
        <div> Modal. The tab number depends on the selected event
        repeat user inputs 
        	<modal tabNumber=selectedEvent.tabNumbeR>
        		<ul>
				    ${userEvents.map((i) => html`<li>${i}</li>`)}
				  </ul>
				  <tabs> //otra opcion en vez de tabs es poner el evento completo y dentro del propio evento gestionar el save y todas las tabs.
				  ${tabs.map((i) => html`<tab>
				  	${i.tabType}
				  	</tab>`)}
				  </tabs>
        		for events
        	</modal>
        </div>
        `;
    }
}
customElements.define('user-home', UserHome);

export class BirthdayEvent extends OneClass {
    static get properties() {return {
        color: String,
        icon: String,
        tabNumber: String,
        tab1: String, //time input, maybe put them in tabs array and extract number and tabs
        tab2: String, //day input
        tab3: String,

        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  
    }
     _render() {return html`
        <h2>
            Welcome ${this.user}
        </h2>
        <div> Modal
        </div>
        `;
    }
}
customElements.define('birthday-event', UserHome);

export class TimeInput extends OneClass {
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
        <div> //resize to take the space of the modal
        	<input type="time">
        </div>
        `;
    }
}
customElements.define('time-input', TimeInput);