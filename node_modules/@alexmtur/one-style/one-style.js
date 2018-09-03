import {html} from 'lit-html';

export const oneStyle = html`
<!-- <svg class="one-icon" style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#43CBFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9708CC;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg> -->
<style>
    /** SET UP THE FOLLOWING VARIABLES IN THE INEX BODY:
        --one-primary-color (one-color and one-background)
        --one-secondary-color //maybe not needed, set up locally?
        --one-border-radius
        --one-border
        --one-size
        --one-font
        --

        //create a file to import in the index with the body setup


    **/
    * {
        font: 100% "Lato", sans-serif;
        font-weight: 300 !important;
        color: #333;
     }
    one-icon {
        width: 55px; height: auto;
        color: blue;
        --iron-icon-height: 52px;
        --iron-icon-width: 52px;
        /*--iron-icon-fill-color: (#grad1);*/
        fill: url(#one-gradient);
        /*fill: url(#grad1);
        stroke: #f1f1f1;
        stroke-width: 1px;
        stroke-linejoin: round;*/
    }
    /*one-navbar {*/
        /*position: fixed;*/
        /*top: 0px;*/
        /*left: 0px;*/
        /*width: 100%;*/
        /*z-index: 500;*/
        /*!*--one-background: green;*!*/
        /*!*background-color: pink;*!*/
    /*}*/
    one-navbar-item {
        width: 40px;
        --one-icon-size: 30px;
        /*background: blue;*/
    }

    button {
        font-family: inherit;
        font-weight: inherit;
        font-size: 100%;
        background: var(--one-background, #333);
        border-radius: 0px;
        border: 0px;
        padding: 10px 15px 10px 15px;
        color: white;
        cursor: pointer;

    }
    button:hover {
        opacity: 0.8;
    }
    button:focus {
        outline: none;
    }
    a {
        text-decoration: none !important;
        color: white;
    }
    input {
       
    }
    input:required:invalid, input:focus:invalid {
      /* this should be styled by the user in the stylesheet */
      /*check the project from IMPACT*/
      
    }
</style>`;
