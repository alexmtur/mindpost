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
        this.userUrl = '/alex';
        firebase.auth().onAuthStateChanged((user)=>{
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            this.userUrl = '/' + this.userId;
            this.user = user;
            this.email = user.email;
            this.username = user.displayName;
            this.userId = user.uid;
            
            console.log(this.userId);
            history.pushState(null, null, this.userId);
            firestore.collection("users").doc(this.userId).get().then((doc)=>{
			    if (doc.exists) {
			        console.log("Document data:", doc.data());
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			        firestore.collection("users").doc(this.userId).set({
					    name: displayName,
					    email: email,
					    events: []
					})
					.then(function() {
					    console.log("Document successfully written!");
					})
					.catch(function(error) {
					    console.error("Error writing document: ", error);
					});
			    }
			}).catch((error)=>{
			    console.log("Error getting document:", error);
			});
            // ...
          } else {
            // User is signed out.
            // ...
          }

          firestore.collection("events").where("us", "==", "CA")
		    .onSnapshot(function(querySnapshot) {
		        var cities = [];
		        querySnapshot.forEach(function(doc) {
		            cities.push(doc.data().name);
		        });
		        console.log("Current cities in CA: ", cities.join(", "));
		    });
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
		  console.log(result);
		  // ...
		});

    }
    signOut() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }, function(error) {
          // An error happened.
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
        <button on-click=${(e)=>{this.googleSignIn()}}>Google Login</button>
        <button on-click=${(e)=>{this.signOut()}}>Logout</button>
        <p>${this.email}</p>
         //sorry your usser does not exist in the plaform
		  ${this.user
              ? html`Welcome ${this.email} <user-home 
              username=${this.email} 
              activeUrl=${this.userUrl}
              onlinePath=${'users/'+this.userId}
              ></user-home>`
              : html`Please log in`
          }
          Please show the email:
          ${this.user}

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
        this.events = [];
        this.tabs = [];
    }
     _render() {return html`
        <h2>
            Welcome ${this.user}
        </h2>
        <button on-click=${(e)=>{this.googleSignIn()}}>New Event</button>
        <div> Modal. The tab number depends on the selected event
        repeat user inputs 
        	<event-tag></event-tag>
        	<modal tabNumber=selectedEvent.tabNumbeR>
        		<ul>
				    ${this.events.map((i) => html`<li>${i}</li>`)}
				  </ul>
				  <tabs> //otra opcion en vez de tabs es poner el evento completo y dentro del propio evento gestionar el save y todas las tabs.
				  ${this.tabs.map((i) => html`<tab>
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

export class EventTag extends OneClass {
    static get properties() {return {
        color: String,
        icon: String,
        date: {type: Object, public: true},
        time: {type: Object, public: true},
        userId: {type: String, public: true},
        eventId: String,
        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  
        this.date = '2018-11-24';
    }
    saveEvent() {
    	//this.userId = firebase.auth().currentUser.uid;
    	//this.updateStorage();

    	// Add a new document with a generated id.
		let eventDoc = firestore.collection("events").doc();
		//update customer with new event, push id;
		console.log(eventId);
		let userId = firebase.auth().currentUser;

		firestore.collection("users").doc(userId).get().then((doc)=> {
		    if (doc.exists) {
		    	console.log(doc)		        
		  //       this.eventList.push(eventId);
				// firestore.collection("users").doc(userId).update({events: this.eventList});
		    } else {console.log("No such document!");}
		}).catch(function(error) {
		    console.log("Error getting document:", error);
		});

		// later...
		eventDoc.set({date: this.date, time: this.time, userId: userId});
		

    }
     _render() {return html`
        <h3>
            Event Input
        </h3>
        <input type="date" value=${this.date} on-change=${(e)=>{this.date = e.target.value; console.log(this.date)}}>
        <input type="time" value=${this.time} on-change=${(e)=>{this.time = e.target.value; console.log(this.time)}}>

        <button on-click=${(e)=>{this.saveEvent()}}>New Event</button>

        <div> DAte: ${this.date}
        </div>
        `;
    }
}
customElements.define('event-tag', EventTag);

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
customElements.define('birthday-event', BirthdayEvent);

export class TimeInput extends OneClass {
    static get properties() {return {
        username: String,
        password: String
        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  //maybe we can start by a single event or three like event, birthday, alarm. or public event, private event
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