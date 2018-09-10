import {OneClass, html} from '@alexmtur/one-class'
// import {OneIcon} from '@alexmtur/one-icon/one-icon.js'
//https://polymer.github.io/lit-html/guide/writing-templates.html#conditionals-ifs-and-loops

/* Think about the url structure for the app 
/home
/public
/settings
/events/eventId: show the profile of the event in the modal
/users/userId: show the public profile of the user in modal
/other: yield error
*/ 

export class MyApp extends OneClass {
    static get properties() {return {
        user: Object,
        email: String,
        password: String,
        events: Array,
        };
    }
    constructor() {
        super();  
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
            this.user = user;
            this.email = user.email;
            this.username = user.displayName;
            this.userId = user.uid;
            let userPath = 'users/' + this.userId;
            
            this.getOnline(userPath).then((doc) => {
                if(doc) {
                    this.syncFieldOnline(userPath, 'events');
                }
                else {
                    let userData = {
                        name: displayName,
                        email: email,
                        events: []
                    };
                    this.setOnline(userPath, userData);
                }
            });
          }
        });
    }
    googleSignIn() {
    	let provider = new firebase.auth.GoogleAuthProvider();
    	//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    	provider.addScope('https://www.googleapis.com/auth/calendar'); //manage calendars
    	firebase.auth().signInWithPopup(provider).then((result) => {
		  // This gives you a Google Access Token. You can use it to access the Google API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;
		  console.log(result);
		  // ...
		});

    }
    
     _render() {return html`
        <style>
            :host {
                display: block;
                background: transparent;
                /*position: absolute;*/
                top: 0;
                left: 0;
                z-index: 100;
            }            
        </style>
        <h1>
            Welcome to Mindpost!
        </h1>
        
        <button on-click=${(e)=>{this.signOut()}}>Logout</button>
		  ${this.user
              ? html`Welcome ${this.email} 
              <user-home 
              user=${this.user}
              events=${this.events}
              onlinePath=${'users/'+this.userId}
              ></user-home>`
              : html`

              <button on-click=${(e)=>{this.googleSignIn()}}>Google Login</button>
              `
          }
          <one-modal>My content</one-modal>

        `;
    }
   
}
customElements.define('my-app', MyApp);

export class UserHome extends OneClass {
    static get properties() {return {
        user: Object,
        events: Array,
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
        <button on-click=${(e)=>{this.id('newEvent').show()}}>New Event</button>
        <one-modal id="newEvent">
        My fancy content
        </one-modal>
        <div> Modal. The tab number depends on the selected event
        repeat user inputs 
        <ul>
        ${this.events.map((i) => html`<li><event-card eventId=${i}></event-card></li>`)}
      </ul>
        	<event-tag></event-tag>
        	<modal tabNumber=selectedEvent.tabNumbeR>
        		
				  <tabs> //otra opcion en vez de tabs es poner el evento completo y dentro del propio evento gestionar el save y todas las tabs.
				  ${this.tabs.map((i) => html`<tab>
				  	${i.tabType}
				  	</tab>`)}
				  </tabs>
        		for events
        	</modal>
        </div>
        <event-page activeUrl="/events" dataIndex="2"></event-page>
        `;
    }
}
customElements.define('user-home', UserHome);

export class EventCard extends OneClass {
    static get properties() {return {
        eventId: String,
        date: Object,
        time: Object,
        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  //maybe we can start by a single event or three like event, birthday, alarm. or public event, private event
    }
    // connectedCallback() {
    //     //super();
    //     console.log(this.eventId);
    // }
    _propertiesChanged(props, changedProps, prevProps) {
        //required for re-render
        super._propertiesChanged(props, changedProps, prevProps);
        //console.log(props);
        if(this.eventId) {
            firestore.collection("events").doc(this.eventId)
            .onSnapshot((doc) => {
                this.date = doc.data().date;
                this.time = doc.data().time;
            });
        }
    }
     _render() {return html`
        <div>
            Event date: ${this.eventId} and ${this.date} and time: ${this.time}
        </div>
        `;
    }
}
customElements.define('event-card', EventCard);

export class EventPage extends OneClass {
    static get properties() {return {
        username: String,
        password: String
        };
    }
    constructor() {//properties do not take value until first rendered, unless we define them in the constructor
        super();  //maybe we can start by a single event or three like event, birthday, alarm. or public event, private event
    }
    _propertiesChanged(props, changedProps, prevProps) {
        super._propertiesChanged(props, changedProps, prevProps);
        if(this.visible && this.urlData) {
            // firestore.collection("events").doc(this.eventId)
            // .onSnapshot((doc) => {
            //     this.date = doc.data().date;
            //     this.time = doc.data().time;
            // });
        }
    }
     _render() {return html`
        <h2>
            The event page is active and this is the event: ${this.urlData}
        </h2>
        `;
    }
}
customElements.define('event-page', EventPage);

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
        let eventId = eventDoc.id;		//update customer with new event, push id;
		//console.log(eventId);
		let userId = firebase.auth().currentUser.uid;

		firestore.collection("users").doc(userId).get().then((doc)=> {
		    if (doc.exists) {
		    	//console.log(doc)
                let events = doc.data().events;	
                events.push(eventId);	
				firestore.collection("users").doc(userId).update({events: events});
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


export class OneModal extends OneClass {
    static get properties() {return {
        // use the standard visible to bind to open/close modal
        // icon: {type: String},
        visible: {type: Boolean, public: true},
        noFooter: Boolean,
        noHeader: Boolean,
        noBackdrop: Boolean,
        noCloseIcon: Boolean,
        // title: {type: String},
        //size: String,
    }}
    constructor() {
        super();
        //this.size = 'm';
        this.visible = false;
        this.entryAnimation = 'fade-in';
        this.exitAnimation = 'fade-out';
    }
    _render() {return html`
        <style>
            :host {
                display: flex;
                /*position: absolute;*/
                top: 0;
                left: 0;
                z-index: 100;
            }
            #content {
                display: block;
                position: fixed;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                background-color: var(--one-background, rgba(255, 255, 255, .95));
                border-radius: var(--one-border-radius, 3px);
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                z-index: 1000;
                width: var(--one-width, 95vw);
                height: var(--one-height, 95vh);
                max-width: var(--one-max-width);
                max-height: var(--one-max-height);
                display: flex;
                justify-content: center;
                align-items: space-between;
                flex-direction: column;
                /*padding: 10px;*/
            }
            #body {
                flex: 1;
            }
            #header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #f1f1f1;
                /*background: pink;*/
            }
            #header[hidden], #footer[hidden], #backdrop[hidden], #close[hidden] {
                display: none;
            }
            #header-text {
                padding: 15px 0 15px 0;
                text-align: center;
                flex:1;
                /*padding-left:40px;*/
                font-size: 120%;
                color: #999;
            }
            /*#header-icon {
                width: 30px;
                height: auto;
                padding-right: 20px;
            }*/
            #footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top: 1px solid #f1f1f1;
                /*background: pink;*/
            }

            #close {
                position: absolute;
                top: 0;
                right: 0;
                width: 20px;
                height: auto;
                padding: 10px;
                /*color: lightgray;*/
                cursor: pointer;
                fill: var(--one-icon-fill, #333);
                /*align-self: flex-start;*/
                /*padding: 10px;*/
                /*fill:url(#red-gradient);*/
            }
            #close:hover {
                opacity: 0.5;
            }
            #backdrop {
                display: block;
                z-index: 0;
                position: fixed;
                top:0;
                left: 0;
                height: 100vh;
                width: 100vw;
                background: rgba(0,0,0,0.5);
            }
            #text {
                font-size: 80%;
            }
/*
            iron-icon {
                display: flex;
                width: var(--one-icon-size, 30px);
                height: auto;
                margin: 0;
                border: solid 2px white;
                border-radius: 30px;
                padding: 5px;
                color: pink;
            }
            iron-icon[hidden] {
                display: none;
            }*/

        </style>


        <!--<div id="content" closed$="[[!open]]" size$="[[size]]">-->
        <div id="backdrop" on-click=${(e) => this.hide(e)} hidden$=${this.noBackdrop} entry-animation="fade-in" exit-animation="fade-out"></div>
        <div id="content" entry-animation="horizontal-expand" entry-animation="horizontal-shrink">

            <one-icon icon="close" id="close" on-click="${(e) => this.hide(e)}" hidden$="${this.noCloseIcon}"></one-icon>

            <div id="header" hidden$=${this.noHeader}>
                <div id="header-text">
                    <slot name="header">
                
                    </slot>
                </div> 
            </div>
            <div id="body">
                <slot>

                </slot>
            </div>
            <div id="footer" hidden$=${this.noFooter}>
                <slot name="footer">

                </slot>
            </div>
        </div>`;
    }
}
customElements.define('one-modal', OneModal);