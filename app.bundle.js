!function(e){var t={};function s(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=t,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=14)}([function(e,t,s){"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const n=`{{lit-${String(Math.random()).slice(2)}}}`;t.f=n;const r=`\x3c!--${n}--\x3e`;t.g=r;const o=new RegExp(`${n}|${r}`),i="$lit$";t.b=i;t.a=class{constructor(e,t){this.parts=[],this.element=t;const s=[],r=[],d=document.createTreeWalker(t.content,133,null,!1);let u=0,h=-1,p=0;const{strings:m,values:{length:g}}=e;for(;p<g;){const e=d.nextNode();if(null!==e){if(h++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:s}=t;let n=0;for(let e=0;e<s;e++)a(t[e].name,i)&&n++;for(;n-- >0;){const t=m[p],s=c.exec(t)[2],n=s.toLowerCase()+i,r=e.getAttribute(n);e.removeAttribute(n);const a=r.split(o);this.parts.push({type:"attribute",index:h,name:s,strings:a}),p+=a.length-1}}"TEMPLATE"===e.tagName&&(r.push(e),d.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,r=t.split(o),d=r.length-1;for(let t=0;t<d;t++){let s,o=r[t];if(""===o)s=l();else{const e=c.exec(o);null!==e&&a(e[2],i)&&(o=o.slice(0,e.index)+e[1]+e[2].slice(0,-i.length)+e[3]),s=document.createTextNode(o)}n.insertBefore(s,e),this.parts.push({type:"node",index:++h})}""===r[d]?(n.insertBefore(l(),e),s.push(e)):e.data=r[d],p+=d}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&h!==u||(h++,t.insertBefore(l(),e)),u=h,this.parts.push({type:"node",index:h}),null===e.nextSibling?e.data="":(s.push(e),h--),p++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),p++}}else d.currentNode=r.pop()}for(const e of s)e.parentNode.removeChild(e)}};const a=(e,t)=>{const s=e.length-t.length;return s>=0&&e.slice(s)===t};t.d=(e=>-1!==e.index);const l=()=>document.createComment("");t.c=l;const c=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;t.e=c},function(e,t,s){"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const n=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback;t.a=n;t.c=((e,t,s=null,n=null)=>{for(;t!==s;){const s=t.nextSibling;e.insertBefore(t,n),t=s}});t.b=((e,t,s=null)=>{for(;t!==s;){const s=t.nextSibling;e.removeChild(t),t=s}})},function(e,t,s){"use strict";var n=s(1),r=s(0);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class o{constructor(e,t,s,n){this.strings=e,this.values=t,this.type=s,this.processor=n}getHTML(){const e=this.strings.length-1;let t="",s=!1;for(let n=0;n<e;n++){const e=this.strings[n],o=e.lastIndexOf("\x3c!--");s=(o>-1||s)&&-1===e.indexOf("--\x3e",o+1);const i=r.e.exec(e);t+=null===i?e+(s?r.f:r.g):e.substr(0,i.index)+i[1]+i[2]+r.b+i[3]+r.f}return t+=this.strings[e]}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}t.b=o;t.a=class extends o{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const e=super.getTemplateElement(),t=e.content,s=t.firstChild;return t.removeChild(s),Object(n.c)(t,s.firstChild),e}}},function(e,t,s){"use strict";var n=s(7),r=s(2);s(8),s(1),s(9),s(4),s(10),s(6),s(5);s.d(t,"a",function(){return r.b});s(0);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.0.0");t.b=((e,...t)=>new r.b(e,t,"html",n.a))},function(e,t,s){"use strict";var n=s(8),r=s(1),o=s(9),i=s(5),a=s(2),l=s(0);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const c=e=>null===e||!("object"==typeof e||"function"==typeof e),d=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class u{constructor(e,t,s){this.dirty=!0,this.element=e,this.name=t,this.strings=s,this.parts=[];for(let e=0;e<s.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new h(this)}_getValue(){const e=this.strings,t=e.length-1;let s="";for(let n=0;n<t;n++){s+=e[n];const t=this.parts[n];if(void 0!==t){const e=t.value;if(c(e)||!d(e))s+="string"==typeof e?e:String(e);else for(const t of e)s+="string"==typeof t?t:String(t)}}return s+=e[t]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}t.a=u;class h{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===o.a||c(e)&&e===this.value||(this.value=e,Object(n.a)(e)||(this.committer.dirty=!0))}commit(){for(;Object(n.a)(this.value);){const e=this.value;this.value=o.a,e(this)}this.value!==o.a&&this.committer.commit()}}class p{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(Object(l.c)()),this.endNode=e.appendChild(Object(l.c)())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=Object(l.c)()),e.__insert(this.endNode=Object(l.c)())}insertAfterPart(e){e.__insert(this.startNode=Object(l.c)()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;Object(n.a)(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=o.a,e(this)}const e=this.__pendingValue;e!==o.a&&(c(e)?e!==this.value&&this.__commitText(e):e instanceof a.b?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):d(e)?this.__commitIterable(e):e===o.b?(this.value=o.b,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling;e=null==e?"":e,t===this.endNode.previousSibling&&3===t.nodeType?t.data=e:this.__commitNode(document.createTextNode("string"==typeof e?e:String(e))),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof i.a&&this.value.template===t)this.value.update(e.values);else{const s=new i.a(t,e.processor,this.options),n=s._clone();s.update(e.values),this.__commitNode(n),this.value=s}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let s,n=0;for(const r of e)void 0===(s=t[n])&&(s=new p(this.options),t.push(s),0===n?s.appendIntoPart(this):s.insertAfterPart(t[n-1])),s.setValue(r),s.commit(),n++;n<t.length&&(t.length=n,this.clear(s&&s.endNode))}clear(e=this.startNode){Object(r.b)(this.startNode.parentNode,e.nextSibling,this.endNode)}}t.d=p;t.b=class{constructor(e,t,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=s}setValue(e){this.__pendingValue=e}commit(){for(;Object(n.a)(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=o.a,e(this)}if(this.__pendingValue===o.a)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=o.a}};t.e=class extends u{constructor(e,t,s){super(e,t,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new m(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}};class m extends h{}let g=!1;try{const e={get capture(){return g=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}t.c=class{constructor(e,t,s){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=s,this.__boundHandleEvent=(e=>this.handleEvent(e))}setValue(e){this.__pendingValue=e}commit(){for(;Object(n.a)(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=o.a,e(this)}if(this.__pendingValue===o.a)return;const e=this.__pendingValue,t=this.value,s=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),r=null!=e&&(null==t||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),r&&(this.__options=f(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=o.a}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}};const f=e=>e&&(g?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)},function(e,t,s){"use strict";var n=s(1),r=s(0);t.a=
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{constructor(e,t,s){this.__parts=[],this.template=e,this.processor=t,this.options=s}update(e){let t=0;for(const s of this.__parts)void 0!==s&&s.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=n.a?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],s=this.template.parts,o=document.createTreeWalker(e,133,null,!1);let i,a=0,l=0,c=o.nextNode();for(;a<s.length;)if(i=s[a],Object(r.d)(i)){for(;l<i.index;)l++,"TEMPLATE"===c.nodeName&&(t.push(c),o.currentNode=c.content),null===(c=o.nextNode())&&(o.currentNode=t.pop(),c=o.nextNode());if("node"===i.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,i.name,i.strings,this.options));a++}else this.__parts.push(void 0),a++;return n.a&&(document.adoptNode(e),customElements.upgrade(e)),e}}},function(e,t,s){"use strict";t.b=
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
function(e){let t=r.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},r.set(e.type,t));let s=t.stringsArray.get(e.strings);if(void 0!==s)return s;const o=e.strings.join(n.f);void 0===(s=t.keyString.get(o))&&(s=new n.a(e,e.getTemplateElement()),t.keyString.set(o,s));return t.stringsArray.set(e.strings,s),s};var n=s(0);const r=new Map;t.a=r},function(e,t,s){"use strict";var n=s(4);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const r=new class{handleAttributeExpressions(e,t,s,r){const o=t[0];return"."===o?new n.e(e,t.slice(1),s).parts:"@"===o?[new n.c(e,t.slice(1),r.eventContext)]:"?"===o?[new n.b(e,t.slice(1),s)]:new n.a(e,t,s).parts}handleTextExpression(e){return new n.d(e)}};t.a=r},function(e,t,s){"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const n=new WeakMap;t.a=(e=>"function"==typeof e&&n.has(e))},function(e,t,s){"use strict";
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */t.a={};t.b={}},function(e,t,s){"use strict";var n=s(1),r=s(4),o=s(6);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const i=new WeakMap;t.a=i;t.b=((e,t,s)=>{let a=i.get(t);void 0===a&&(Object(n.b)(t,t.firstChild),i.set(t,a=new r.d(Object.assign({templateFactory:o.b},s))),a.appendInto(t)),a.setValue(e),a.commit()})},function(e,t,s){"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */window.JSCompiler_renameProperty=((e,t)=>e);const n={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},r=(e,t)=>t!==e&&(t==t||e==e),o={attribute:!0,type:String,converter:n,reflect:!1,hasChanged:r},i=Promise.resolve(!0),a=1,l=4,c=8,d=16,u=32;class h extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=i,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,s)=>{const n=this._attributeNameForProperty(s,t);void 0!==n&&(this._attributeToPropertyMap.set(n,s),e.push(n))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=o){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const s="symbol"==typeof e?Symbol():`__${e}`;Object.defineProperty(this.prototype,e,{get(){return this[s]},set(t){const n=this[e];this[s]=t,this._requestUpdate(e,n)},configurable:!0,enumerable:!0})}static finalize(){if(this.hasOwnProperty(JSCompiler_renameProperty("finalized",this))&&this.finalized)return;const e=Object.getPrototypeOf(this);if("function"==typeof e.finalize&&e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const s of t)this.createProperty(s,e[s])}}static _attributeNameForProperty(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,s=r){return s(e,t)}static _propertyValueFromAttribute(e,t){const s=t.type,r=t.converter||n,o="function"==typeof r?r:r.fromAttribute;return o?o(e,s):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const s=t.type,r=t.converter;return(r&&r.toAttribute||n.toAttribute)(e,s)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|u,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,s){t!==s&&this._attributeToProperty(e,s)}_propertyToAttribute(e,t,s=o){const n=this.constructor,r=n._attributeNameForProperty(e,s);if(void 0!==r){const e=n._propertyValueToAttribute(t,s);if(void 0===e)return;this._updateState=this._updateState|c,null==e?this.removeAttribute(r):this.setAttribute(r,e),this._updateState=this._updateState&~c}}_attributeToProperty(e,t){if(this._updateState&c)return;const s=this.constructor,n=s._attributeToPropertyMap.get(e);if(void 0!==n){const e=s._classProperties.get(n)||o;this._updateState=this._updateState|d,this[n]=s._propertyValueFromAttribute(t,e),this._updateState=this._updateState&~d}}_requestUpdate(e,t){let s=!0;if(void 0!==e){const n=this.constructor,r=n._classProperties.get(e)||o;n._valueHasChanged(this[e],t,r.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==r.reflect||this._updateState&d||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,r))):s=!1}!this._hasRequestedUpdate&&s&&this._enqueueUpdate()}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){let e,t;this._updateState=this._updateState|l;const s=this._updatePromise;this._updatePromise=new Promise((s,n)=>{e=s,t=n});try{await s}catch(e){}this._hasConnected||await new Promise(e=>this._hasConnectedResolver=e);try{const e=this.performUpdate();null!=e&&await e}catch(e){t(e)}e(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&u}get _hasRequestedUpdate(){return this._updateState&l}get hasUpdated(){return this._updateState&a}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{(e=this.shouldUpdate(t))&&this.update(t)}catch(t){throw e=!1,t}finally{this._markUpdated()}e&&(this._updateState&a||(this._updateState=this._updateState|a,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~l}get updateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0)}updated(e){}firstUpdated(e){}}t.a=h,h.finalized=!0},function(e,t,s){"use strict";
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const n="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype;t.b=n;const r=Symbol();class o{constructor(e,t){if(t!==r)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(n?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}t.a=((e,...t)=>{const s=t.reduce((t,s,n)=>t+(e=>{if(e instanceof o)return e.cssText;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+e[n+1],e[0]);return new o(s,r)})},function(e,t,s){"use strict";const n=[([e,t])=>[e,t],([e,t])=>[-t,e],([e,t])=>[-e,-t],([e,t])=>[t,-e]],r=([e,t])=>[-e,t],o=([e,t])=>e,i=([e,t])=>t;class a{constructor(e){this.coords=e}clone(){return new a(this.coords)}normalize(){let e=Math.min(...this.coords.map(o)),t=Math.min(...this.coords.map(i));return this.translate(-e,-t)}isEmpty(){return 0==this.coords.length}rotate(e){let t=e%4;return new a(this.coords.map(n[t]))}reflect(){return new a(this.coords.map(r))}translate(e,t){return new a(this.coords.map(([s,n])=>[s+e,n+t]))}isDisjointFrom(e){for(let t of this.coords)for(let s of e.coords)if(t[0]==s[0]&&t[1]==s[1])return!1;return!0}getWidth(){let e=this.coords.map(o);return Math.max(...e)-Math.min(...e)+1}getHeight(){let e=this.coords.map(i);return Math.max(...e)-Math.min(...e)+1}getSize(){return Math.max(this.getWidth(),this.getHeight())}getLargestX(){return Math.max(...this.coords.map(o))}getLargestY(){return Math.max(...this.coords.map(i))}containsCoordinate(e){return this.coords.some(([t,s])=>t==e[0]&&s==e[1])}}t.a=a;const l={I:new a([[0,0],[0,1],[0,2],[0,3]]),O:new a([[0,0],[0,1],[1,1],[1,0]]),T:new a([[0,1],[1,1],[1,0],[2,1]]),J:new a([[0,0],[1,0],[1,1],[1,2]]),L:new a([[0,2],[0,1],[0,0],[1,0]]),S:new a([[0,0],[1,0],[1,1],[2,1]]),Z:new a([[0,1],[1,1],[1,0],[2,0]])};t.b=l},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s(15),r=(s.n(n),s(16)),o=s.n(r),i=(s(17),s(24));document.getElementById("loading-image").src=o.a,(new i.a).init()},function(e,t){},function(e,t){e.exports="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="},function(e,t,s){"use strict";var n=s(18);"customElements"in window&&window.customElements.define("polyomino-control",n.a)},function(e,t,s){"use strict";var n=s(19),r=s(23),o=s.n(r);function i(e,t){return e[0]==t[0]&&e[1]==t[1]}t.a=class extends n.a{static get properties(){return{mode:{type:String},size:{type:Number},value:{type:Array}}}static get styles(){return n["b"]`
            .grid-container {
                display: grid;
                width: 100%;
                height: 100%;
                outline: 2px solid black;
                grid-template: repeat($rows, 1fr) / repeat($columns, 1fr);
                grid-gap: 2px;
            }
            .grid-container.display {
                outline: none;
            }
            .grid-container.create-region, .grid-container.display-multiple {
                background: lightgray;
            }
            
            .cell {
                outline: 2px solid black;
            }

            .grid-container.display .cell {
                outline: none;
            }

            .grid-container.display .cell.active, .grid-container.display-multiple .cell.active {
                outline: 2px solid black;
            }

            .grid-container.create-region .cell, .grid-container.display-multiple .cell {
                outline: none;
            }

            .grid-container.create-region .cell.active {
                outline: 2px solid black;
            }
        `}constructor(){super(),this.mode="create",this.size=4,this.value=[]}render(){const e="display-multiple"==this.mode?this.value:[[],this.value];let t=null;if("display-multiple"==this.mode){const s=Math.round(360/(this.value.length-1)),n=Math.floor(360*Math.random());t=["white",...e.slice(1).map((e,t)=>{const r=(n+s*t)%360;return o.a.make_color({golden:!1,hue:r,saturation:.8})[0]})]}else t="create-region"==this.mode?["white","white"]:["white","cyan"];return n["c"]`
            <div class="grid-container ${this.mode}">
                ${Array.from(function*(e){for(let t=0;t<e;t++)for(let s=0;s<e;s++)yield[t,s]}(this.size)).map(([s,r])=>{const o=s+1,a=this.size-r;let l=["cell"],c=null;for(let[n,o]of e.entries())o.some(e=>i(e,[s,r]))&&(l.push("active"),c=t[n]);const d=this.mode.startsWith("create"),u=null!=c?`background-color: ${c}`:"";return n["c"]`
                        <div 
                            class="${l.join(" ")}"
                            style="grid-column: ${o}; grid-row: ${a}; ${u}"
                            @mousedown=${d?e=>this.toggle(s,r):null}
                            @mouseenter=${d?e=>{1==e.buttons&&this.toggle(s,r)}:null}
                        >
                        </div>
                    `})}
            </div>
        `}toggle(e,t){const s=[e,t];let n=this.value.findIndex(e=>i(e,s));this.value=n>=0?this.value.filter((e,t)=>t!=n):[...this.value,s]}}},function(e,t,s){"use strict";var n=s(3),r=s(20),o=s(11),i=(s(22),s(3));s.d(t,"c",function(){return i.b});var a=s(12);s.d(t,"b",function(){return a.a}),
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.0.1");const l=e=>e.flat?e.flat(1/0):function e(t,s=[]){for(let n=0,r=t.length;n<r;n++){const r=t[n];Array.isArray(r)?e(r,s):s.push(r)}return s}(e);class c extends o.a{static finalize(){super.finalize(),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const e=this.styles,t=[];if(Array.isArray(e)){l(e).reduceRight((e,t)=>(e.add(t),e),new Set).forEach(e=>t.unshift(e))}else e&&t.push(e);return t}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?a.b?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){super.update(e);const t=this.render();t instanceof n.a&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){}}t.a=c,c.finalized=!0,c.render=r.a},function(e,t,s){"use strict";var n=s(1),r=s(21),o=s(10),i=s(6),a=s(5),l=s(2),c=s(0);s(3);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const d=(e,t)=>`${e}--${t}`;let u=!0;void 0===window.ShadyCSS?u=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),u=!1);const h=["html","svg"],p=new Set,m=(e,t,s)=>{p.add(s);const n=e.querySelectorAll("style"),{length:o}=n;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(t.element,s);const a=document.createElement("style");for(let e=0;e<o;e++){const t=n[e];t.parentNode.removeChild(t),a.textContent+=t.textContent}(e=>{h.forEach(t=>{const s=i.a.get(d(t,e));void 0!==s&&s.keyString.forEach(e=>{const{element:{content:t}}=e,s=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{s.add(e)}),Object(r.b)(e,s)})})})(s);const l=t.element.content;Object(r.a)(t,a,l.firstChild),window.ShadyCSS.prepareTemplateStyles(t.element,s);const c=l.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==c)e.insertBefore(c.cloneNode(!0),e.firstChild);else{l.insertBefore(a,l.firstChild);const e=new Set;e.add(a),Object(r.b)(t,e)}};t.a=((e,t,s)=>{const r=s.scopeName,h=o.a.has(t),g=u&&11===t.nodeType&&!!t.host&&e instanceof l.b,f=g&&!p.has(r),y=f?document.createDocumentFragment():t;if(Object(o.b)(e,y,Object.assign({templateFactory:(e=>t=>{const s=d(t.type,e);let n=i.a.get(s);void 0===n&&(n={stringsArray:new WeakMap,keyString:new Map},i.a.set(s,n));let r=n.stringsArray.get(t.strings);if(void 0!==r)return r;const o=t.strings.join(c.f);if(void 0===(r=n.keyString.get(o))){const s=t.getTemplateElement();u&&window.ShadyCSS.prepareTemplateDom(s,e),r=new c.a(t,s),n.keyString.set(o,r)}return n.stringsArray.set(t.strings,r),r})(r)},s)),f){const e=o.a.get(y);o.a.delete(y),e.value instanceof a.a&&m(y,e.value.template,r),Object(n.b)(t,t.firstChild),t.appendChild(y),o.a.set(t,e)}!h&&g&&window.ShadyCSS.styleElement(t.host)})},function(e,t,s){"use strict";t.b=function(e,t){const{element:{content:s},parts:n}=e,o=document.createTreeWalker(s,r,null,!1);let a=i(n),l=n[a],c=-1,d=0;const u=[];let h=null;for(;o.nextNode();){c++;const e=o.currentNode;for(e.previousSibling===h&&(h=null),t.has(e)&&(u.push(e),null===h&&(h=e)),null!==h&&d++;void 0!==l&&l.index===c;)l.index=null!==h?-1:l.index-d,a=i(n,a),l=n[a]}u.forEach(e=>e.parentNode.removeChild(e))},t.a=function(e,t,s=null){const{element:{content:n},parts:a}=e;if(null===s||void 0===s)return void n.appendChild(t);const l=document.createTreeWalker(n,r,null,!1);let c=i(a),d=0,u=-1;for(;l.nextNode();){u++;const e=l.currentNode;for(e===s&&(d=o(t),s.parentNode.insertBefore(t,s));-1!==c&&a[c].index===u;){if(d>0){for(;-1!==c;)a[c].index+=d,c=i(a,c);return}c=i(a,c)}}};var n=s(0);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const r=133;const o=e=>{let t=11===e.nodeType?0:1;const s=document.createTreeWalker(e,r,null,!1);for(;s.nextNode();)t++;return t},i=(e,t=-1)=>{for(let s=t+1;s<e.length;s++){const t=e[s];if(Object(n.d)(t))return s}return-1}},function(e,t,s){"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */},function(e,t,s){var n,r,o;/*!Please JS v0.4.2, Jordan Checkman 2014, Checkman.io, MIT License, Have fun.*/!function(s,i,a){r=[],void 0===(o="function"==typeof(n=a)?n.apply(t,r):n)||(e.exports=o)}(0,0,function(){"use strict";return function(){function e(e,t,s){var n=Math.random;return s instanceof o&&(n=s.random),Math.floor(n()*(t-e+1))+e}function t(e,t,s){var n=Math.random;return s instanceof o&&(n=s.random),n()*(t-e)+e}function s(e,t,s){return Math.max(t,Math.min(e,s))}function n(e,t){var s;switch(e){case"hex":for(s=0;s<t.length;s++)t[s]=i.HSV_to_HEX(t[s]);break;case"rgb":for(s=0;s<t.length;s++)t[s]=i.HSV_to_RGB(t[s]);break;case"rgb-string":for(s=0;s<t.length;s++){var n=i.HSV_to_RGB(t[s]);t[s]="rgb("+n.r+","+n.g+","+n.b+")"}break;case"hsv":break;default:console.error("Format not recognized.")}return t}function r(e){var t={};for(var s in e)e.hasOwnProperty(s)&&(t[s]=e[s]);return t}function o(e){function t(){r=(r+s[n=(n+1)%256])%256;var e=s[n];return s[n]=s[r],s[r]=e,s[(s[n]+s[r])%256]}for(var s=[],n=0,r=0,o=0;256>o;o++)s[o]=o;for(var i=0,a=0;256>i;i++){a=(a+s[i]+e.charCodeAt(i%e.length))%256;var l=s[i];s[i]=s[a],s[a]=l}this.random=function(){for(var e=0,s=0,n=1;8>e;e++)s+=t()*n,n*=256;return s/0x10000000000000000}}var i={},a={aliceblue:"F0F8FF",antiquewhite:"FAEBD7",aqua:"00FFFF",aquamarine:"7FFFD4",azure:"F0FFFF",beige:"F5F5DC",bisque:"FFE4C4",black:"000000",blanchedalmond:"FFEBCD",blue:"0000FF",blueviolet:"8A2BE2",brown:"A52A2A",burlywood:"DEB887",cadetblue:"5F9EA0",chartreuse:"7FFF00",chocolate:"D2691E",coral:"FF7F50",cornflowerblue:"6495ED",cornsilk:"FFF8DC",crimson:"DC143C",cyan:"00FFFF",darkblue:"00008B",darkcyan:"008B8B",darkgoldenrod:"B8860B",darkgray:"A9A9A9",darkgrey:"A9A9A9",darkgreen:"006400",darkkhaki:"BDB76B",darkmagenta:"8B008B",darkolivegreen:"556B2F",darkorange:"FF8C00",darkorchid:"9932CC",darkred:"8B0000",darksalmon:"E9967A",darkseagreen:"8FBC8F",darkslateblue:"483D8B",darkslategray:"2F4F4F",darkslategrey:"2F4F4F",darkturquoise:"00CED1",darkviolet:"9400D3",deeppink:"FF1493",deepskyblue:"00BFFF",dimgray:"696969",dimgrey:"696969",dodgerblue:"1E90FF",firebrick:"B22222",floralwhite:"FFFAF0",forestgreen:"228B22",fuchsia:"FF00FF",gainsboro:"DCDCDC",ghostwhite:"F8F8FF",gold:"FFD700",goldenrod:"DAA520",gray:"808080",grey:"808080",green:"008000",greenyellow:"ADFF2F",honeydew:"F0FFF0",hotpink:"FF69B4",indianred:"CD5C5C",indigo:"4B0082",ivory:"FFFFF0",khaki:"F0E68C",lavender:"E6E6FA",lavenderblush:"FFF0F5",lawngreen:"7CFC00",lemonchiffon:"FFFACD",lightblue:"ADD8E6",lightcoral:"F08080",lightcyan:"E0FFFF",lightgoldenrodyellow:"FAFAD2",lightgray:"D3D3D3",lightgrey:"D3D3D3",lightgreen:"90EE90",lightpink:"FFB6C1",lightsalmon:"FFA07A",lightseagreen:"20B2AA",lightskyblue:"87CEFA",lightslategray:"778899",lightslategrey:"778899",lightsteelblue:"B0C4DE",lightyellow:"FFFFE0",lime:"00FF00",limegreen:"32CD32",linen:"FAF0E6",magenta:"FF00FF",maroon:"800000",mediumaquamarine:"66CDAA",mediumblue:"0000CD",mediumorchid:"BA55D3",mediumpurple:"9370D8",mediumseagreen:"3CB371",mediumslateblue:"7B68EE",mediumspringgreen:"00FA9A",mediumturquoise:"48D1CC",mediumvioletred:"C71585",midnightblue:"191970",mintcream:"F5FFFA",mistyrose:"FFE4E1",moccasin:"FFE4B5",navajowhite:"FFDEAD",navy:"000080",oldlace:"FDF5E6",olive:"808000",olivedrab:"6B8E23",orange:"FFA500",orangered:"FF4500",orchid:"DA70D6",palegoldenrod:"EEE8AA",palegreen:"98FB98",paleturquoise:"AFEEEE",palevioletred:"D87093",papayawhip:"FFEFD5",peachpuff:"FFDAB9",peru:"CD853F",pink:"FFC0CB",plum:"DDA0DD",powderblue:"B0E0E6",purple:"800080",rebeccapurple:"663399",red:"FF0000",rosybrown:"BC8F8F",royalblue:"4169E1",saddlebrown:"8B4513",salmon:"FA8072",sandybrown:"F4A460",seagreen:"2E8B57",seashell:"FFF5EE",sienna:"A0522D",silver:"C0C0C0",skyblue:"87CEEB",slateblue:"6A5ACD",slategray:"708090",slategrey:"708090",snow:"FFFAFA",springgreen:"00FF7F",steelblue:"4682B4",tan:"D2B48C",teal:"008080",thistle:"D8BFD8",tomato:"FF6347",turquoise:"40E0D0",violet:"EE82EE",wheat:"F5DEB3",white:"FFFFFF",whitesmoke:"F5F5F5",yellow:"FFFF00",yellowgreen:"9ACD32"},l=.618033988749895,c={hue:null,saturation:null,value:null,base_color:"",greyscale:!1,grayscale:!1,golden:!0,full_random:!1,colors_returned:1,format:"hex",seed:null},d={scheme_type:"analogous",format:"hex"},u={golden:!1,format:"hex"};return i.NAME_to_HEX=function(e){return(e=e.toLowerCase())in a?a[e]:void console.error("Color name not recognized.")},i.NAME_to_RGB=function(e){return i.HEX_to_RGB(i.NAME_to_HEX(e))},i.NAME_to_HSV=function(e){return i.HEX_to_HSV(i.NAME_to_HEX(e))},i.HEX_to_RGB=function(e){e=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(e,t,s,n){return t+t+s+s+n+n});var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null},i.RGB_to_HEX=function(e){return"#"+((1<<24)+(e.r<<16)+(e.g<<8)+e.b).toString(16).slice(1)},i.HSV_to_RGB=function(e){var t,s,n,r,o,i,a,l,c=e.h,d=e.s,u=e.v;if(0===d)return{r:u,g:u,b:u};switch(i=u*(1-d),a=u*(1-d*(o=(c/=60)-(r=Math.floor(c)))),l=u*(1-d*(1-o)),r){case 0:t=u,s=l,n=i;break;case 1:t=a,s=u,n=i;break;case 2:t=i,s=u,n=l;break;case 3:t=i,s=a,n=u;break;case 4:t=l,s=i,n=u;break;case 5:t=u,s=i,n=a}return{r:Math.floor(255*t),g:Math.floor(255*s),b:Math.floor(255*n)}},i.RGB_to_HSV=function(e){var t=e.r/255,s=e.g/255,n=e.b/255,r=Math.min(t,Math.min(s,n)),o=Math.max(t,Math.max(s,n));return r===o?{h:0,s:0,v:r}:{h:60*((t===r?3:n===r?1:5)-(t===r?s-n:n===r?t-s:n-t)/(o-r)),s:(o-r)/o,v:o}},i.HSV_to_HEX=function(e){return i.RGB_to_HEX(i.HSV_to_RGB(e))},i.HEX_to_HSV=function(e){return i.RGB_to_HSV(i.HEX_to_RGB(e))},i.make_scheme=function(e,t){function o(e){return{h:e.h,s:e.s,v:e.v}}var i,a,l,c,u,h=r(d);if(null!==t)for(var p in t)t.hasOwnProperty(p)&&(h[p]=t[p]);var m=[e];switch(h.scheme_type.toLowerCase()){case"monochromatic":case"mono":for(u=1;2>=u;u++)l=s(l=(i=o(e)).s+.1*u,0,1),c=s(c=i.v+.1*u,0,1),i.s=l,i.v=c,m.push(i);for(u=1;2>=u;u++)l=s(l=(i=o(e)).s-.1*u,0,1),c=s(c=i.v-.1*u,0,1),i.s=l,i.v=c,m.push(i);break;case"complementary":case"complement":case"comp":(i=o(e)).h=(i.h+180)%360,m.push(i);break;case"split-complementary":case"split-complement":case"split":(i=o(e)).h=(i.h+165)%360,m.push(i),(i=o(e)).h=Math.abs((i.h-165)%360),m.push(i);break;case"double-complementary":case"double-complement":case"double":(i=o(e)).h=(i.h+180)%360,m.push(i),i.h=(i.h+30)%360,a=o(i),m.push(i),i.h=(i.h+180)%360,m.push(a);break;case"analogous":case"ana":for(u=1;5>=u;u++)(i=o(e)).h=(i.h+20*u)%360,m.push(i);break;case"triadic":case"triad":case"tri":for(u=1;3>u;u++)(i=o(e)).h=(i.h+120*u)%360,m.push(i);break;default:console.error("Color scheme not recognized.")}return n(h.format.toLowerCase(),m),m},i.make_color=function(a){var d=[],u=r(c),h=null;if(null!==a)for(var p in a)a.hasOwnProperty(p)&&(u[p]=a[p]);var m=null;"string"==typeof u.seed&&(m=new o(u.seed)),u.base_color.length>0&&(h=u.base_color.match(/^#?([0-9a-f]{3})([0-9a-f]{3})?$/i)?i.HEX_to_HSV(u.base_color):i.NAME_to_HSV(u.base_color));for(var g=0;g<u.colors_returned;g++){var f,y,_,v=e(0,360,m);null!==h?(f=s(e(h.h-5,h.h+5,m),0,360),y=0===h.s?0:t(.4,.85,m),_=t(.4,.85,m),d.push({h:f,s:y,v:_})):(f=!0===u.greyscale||!0===u.grayscale?0:!0===u.golden?(v+v/l)%360:null===u.hue||!0===u.full_random?v:s(u.hue,0,360),y=!0===u.greyscale||!0===u.grayscale?0:!0===u.full_random?t(0,1,m):null===u.saturation?.4:s(u.saturation,0,1),_=!0===u.full_random?t(0,1,m):!0===u.greyscale||!0===u.grayscale?t(.15,.75,m):null===u.value?.75:s(u.value,0,1),d.push({h:f,s:y,v:_}))}return n(u.format.toLowerCase(),d),d},i.make_contrast=function(e,t){var o=r(u);if(null!==t)for(var a in t)t.hasOwnProperty(a)&&(o[a]=t[a]);var c,d,h,p=function(e){var t=i.HSV_to_RGB(e);return(299*t.r+587*t.g+114*t.b)/1e3>=128?"dark":"light"}(e);return d=!0===o.golden?e.h*(1+l)%360:s(i.make_scheme(e,{scheme_type:"complementary",format:"hsv"})[1].h-30,0,360),"dark"===p?h=s(e.v-.25,0,1):"light"===p&&(h=s(e.v+.25,0,1)),c=[{h:d,s:e.s,v:h}],n(o.format.toLowerCase(),c),c[0]},i}()})},function(e,t,s){"use strict";var n=s(13),r=s(25),o=s(27),i=s.n(o);t.a=class{init(){document.querySelectorAll(".method-select").forEach(e=>{e.addEventListener("click",e=>{document.querySelectorAll(".method-select").forEach(e=>e.checked=!1),e.target.checked=!0})}),document.querySelector("#method-z3").addEventListener("click",e=>{this.worker.postMessage("loadZ3");let t=document.getElementById("solve-button");t.disabled=!0,t.innerHTML="Loading Z3 ...",t.classList.add("disabled")}),this.worker=new i.a,this.worker.onmessage=(e=>this.handleWorkerMessage(e)),document.getElementById("add-button").addEventListener("click",e=>{let t=document.getElementById("poly-create").value;t.length>0&&this.addSavedPolyomino(t)});for(let e in n.b){let t=document.createElement("polyomino-control");t.style.cssText="width: 60px; height: 60px; display: inline-block;",t.size=4,t.mode="display",document.getElementById("standard-container").appendChild(t),t.value=n.b[e].coords,t.addEventListener("click",e=>{t.value.length>0&&this.addSavedPolyomino(t.value)})}document.getElementById("size-up-button").addEventListener("click",e=>{let t=document.getElementById("region-create");t.size+=1,t.size>20&&(t.size=20),t.redraw()}),document.getElementById("size-down-button").addEventListener("click",e=>{let t=document.getElementById("region-create");t.size-=1,t.size<2&&(t.size=2),t.redraw()}),document.getElementById("solve-button").addEventListener("click",e=>{document.getElementById("no-solution").style.display="none";let t=[];for(let e of document.getElementById("poly-container").children)t.push(new n.a(e.value));let s=document.getElementById("region-create"),o="display-multiple"==s.mode?s.value[0]:s.value,i=new n.a(o),a=document.querySelector(".method-select:checked").id.split("-")[1],l=new r.a(t,i),{convertedProblem:c,interpreter:d}="sat"==a?l.convertToSAT():"z3"==a?l.convertToZ3():"dlx"==a?l.convertToDlx():l.convertToZ3();this.currentlySolving={polyProblem:l,convertedProblem:c,interpreter:d},this.worker.postMessage({type:a,problem:c}),document.getElementById("loading").style.display="block"}),document.getElementById("clear-button").addEventListener("click",e=>{let t=document.getElementById("region-create");t.mode="create-region",t.value=[],document.getElementById("clear-button").style.display="none",document.getElementById("no-solution").style.display="none",document.querySelectorAll(".size-button").forEach(e=>{e.disabled=!1,e.classList.remove("disabled")})})}addSavedPolyomino(e){let t=document.createElement("polyomino-control");t.style.cssText="width: 50px; height: 50px; display: inline-block; margin-right: 10px; vertical-align: top",t.mode="display",document.getElementById("poly-container").appendChild(t);let s=new n.a(e).normalize();return t.size=s.getSize(),t.value=[...s.coords],t.addEventListener("click",e=>{t.remove()}),t}handleWorkerMessage(e){if("z3Loaded"==e.data){let e=document.getElementById("solve-button");return e.disabled=!1,e.innerHTML="Solve",void e.classList.remove("disabled")}let t=e.data.solution;if(t){let e=this.currentlySolving.interpreter(t),s=document.getElementById("region-create");s.mode="display-multiple",s.value=[this.currentlySolving.polyProblem.region.coords,...e.map(e=>e.coords)],document.querySelectorAll(".size-button").forEach(e=>{e.disabled=!0,e.classList.add("disabled")})}else document.getElementById("no-solution").style.display="block";document.getElementById("loading").style.display="none",document.getElementById("clear-button").style.display="block"}}},function(e,t,s){"use strict";var n=s(13),r=s(26);t.a=class{constructor(e,t,s=!0,n=!1){this.pieces=e.map(e=>e.normalize()),this.region=t.normalize(),this.allowRotation=s,this.allowReflection=n,this.width=this.region.getWidth(),this.height=this.region.getHeight()}_fits(e){return e.getLargestX()<this.width&&e.getLargestY()<this.height&&e.coords.every(e=>this.region.containsCoordinate(e))}*_generateAllPossibleConfigurations(e){for(let t of[0,...this.allowRotation?[1,2,3]:[]])for(let s of[!1,...this.allowReflection?[!0]:[]])for(let n=0;n<this.width;n++)for(let r=0;r<this.height;r++){let o=e.rotate(t);s&&(o=o.reflect()),o=(o=o.normalize()).translate(n,r),this._fits(o)&&(yield o)}}convertToSAT(){let e=[],t=1;for(let s of this.pieces){let n=Array.from(this._generateAllPossibleConfigurations(s)),r=t,o={varsOffset:r,varsLength:n.length,varsEnd:r+n.length,getCorrespondingPolyConfiguration:e=>e-r>=0&&e-r<n.length?n[e-r]:null};t+=n.length,e.push(o)}let s=new r.a;for(let t of e)for(let e=t.varsOffset;e<t.varsEnd;e++)for(let n=e+1;n<t.varsEnd;n++)s.beginClause(),s.addNot(e),s.addNot(n),s.endClause();for(let t of e){s.beginClause();for(let e=t.varsOffset;e<t.varsEnd;e++)s.add(e);s.endClause()}for(let t=0;t<e.length;t++)for(let n=t+1;n<e.length;n++){let r=e[t],o=e[n];for(let e=r.varsOffset;e<r.varsEnd;e++)for(let t=o.varsOffset;t<o.varsEnd;t++){let n=r.getCorrespondingPolyConfiguration(e),i=o.getCorrespondingPolyConfiguration(t);n.isDisjointFrom(i)||(s.beginClause(),s.addNot(e),s.addNot(t),s.endClause())}}return{convertedProblem:s.getCNFProblem(),interpreter:t=>t.map((t,s)=>0!=s&&t?e.find(e=>null!=e.getCorrespondingPolyConfiguration(s)).getCorrespondingPolyConfiguration(s):null).filter(e=>null!=e)}}convertToZ3(){let e=[],t=(...e)=>`( ${e.join(" ")} )`,s=e=>t("assert",e),n=(e,t)=>`p_${e}_${t}`,r=this.pieces.map(e=>Array.from(this._generateAllPossibleConfigurations(e)));return r.forEach((s,r)=>{s.forEach((s,o)=>{e.push(t("declare-const",n(r,o),"Bool"))})}),r.forEach((r,o)=>{e.push(s(t(t("_","at-most","1"),...r.map((e,t)=>n(o,t))))),e.push(s(t("or",...r.map((e,t)=>n(o,t)))))}),r.forEach((o,i)=>{o.forEach((o,a)=>{let l=[];r.forEach((e,t)=>{e.forEach((e,s)=>{i!=t&&(o.isDisjointFrom(e)||l.push(n(t,s)))})}),l.length>0&&e.push(s(t("=>",n(i,a),t("not",t("or",...l)))))})}),e.push(t("check-sat")),e.push(t("get-model")),e.push(t("exit")),{convertedProblem:{inputFile:e.join("\n")},interpreter:e=>{let t=[];for(let s of e.slice(1)){let e=s[1];if("true"==s[4]){let[s,n,o]=e.split("_");t.push(r[n][o])}}return t}}}convertToDlx(){let e=[],t=this.pieces.length+this.region.coords.length;this.pieces.forEach((s,n)=>{let r=Array.from(this._generateAllPossibleConfigurations(s));for(let s of r){let r=new Array(t).fill(0);r[n]=1;for(let e of s.coords){let t=this.region.coords.findIndex(t=>e[0]==t[0]&&e[1]==t[1]);r[this.pieces.length+t]=1}e.push(r)}});let s=e=>{let t=e.indexOf(1);return t<0?[]:[t,...s(e.slice(t+1)).map(e=>t+1+e)]};return{convertedProblem:{matrix:e},interpreter:e=>e.map(e=>{let t=s(e.slice(this.pieces.length));return new n.a(t.map(e=>this.region.coords[e]))})}}}},function(e,t,s){"use strict";t.a=class{constructor(){this.clauses=[],this._curClause=null,this.numVars=0}beginClause(){this._curClause=[]}add(e){if(null==this._curClause)throw"add or addNot called without beginClause";this._curClause.push(e),e>this.numVars&&(this.numVars=e)}addNot(e){this.add(-e)}endClause(){this.clauses.push(this._curClause),this._curClause=null}getCNFProblem(){return{numVars:this.numVars,clauseList:this.clauses}}}},function(e,t,s){e.exports=function(){return new Worker(s.p+"d0c0568c465bbce255ee.worker.js")}}]);