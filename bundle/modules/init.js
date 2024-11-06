var v=Object.defineProperty;var D=(n,e,t)=>e in n?v(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var r=(n,e)=>v(n,"name",{value:e,configurable:!0});var p=(n,e,t)=>(D(n,typeof e!="symbol"?e+"":e,t),t);var u={manualHiddenRegions:new Set},y=r((n,e)=>{for(let t of $(e).find(".region-list .region")){let o=t.dataset.regionId,a=u.manualHiddenRegions.has(o)?"-slash":"";$(`<button class="icon regionHider" data-tooltip="REGIONENCHANTMENT.hideRegion"><i class="fas fa-eye${a}"></i></button>`).insertAfter($(t).find(".icon").first())}$(e).find(".regionHider").on("click",async t=>{t.preventDefault(),t.stopPropagation();let o=$(t.currentTarget).closest(".region")[0].dataset.regionId;u.manualHiddenRegions.has(o)?(u.manualHiddenRegions.delete(o),$(t.currentTarget).find("i").removeClass("fa-eye-slash").addClass("fa-eye")):(u.manualHiddenRegions.add(o),$(t.currentTarget).find("i").removeClass("fa-eye").addClass("fa-eye-slash")),canvas.regions.get(o).renderFlags.set({refreshState:!0})})},"addHideRegionButton"),b=r(()=>{let n=canvas.regions.legend._isRegionVisible;canvas.regions.legend._isRegionVisible=function(e){return u.manualHiddenRegions.has(e.id)?!1:n.call(this,e)}},"bindManualHide");var w=r((n,e)=>{$(e).find(".region").each(function(t,o){o.setAttribute("draggable",!0),o.addEventListener("dragstart",a=>I(a))})},"addDragging"),I=r(n=>{let e=n.target.dataset.regionId,t={type:"EnchantedRegion",regionId:e};n.dataTransfer.setData("text/plain",JSON.stringify(t))},"dragRegionLegend");function N(n){n=n.replace(/^#/,"");let e=parseInt(n,16),t=e>>16&255,o=e>>8&255,a=e&255;return[t,o,a]}r(N,"hexToRgb");function x([n,e,t]){let o=[n,e,t].map(function(a){return a/=255,a<=.03928?a/12.92:Math.pow((a+.055)/1.055,2.4)});return o[0]*.2126+o[1]*.7152+o[2]*.0722}r(x,"getLuminance");function R(n){let e=N(n);return x(e)>.5?"#000000":"#FFFFFF"}r(R,"getBestContrastColor");var m=r((n,e)=>{let t=$(`<button class="save-only" type="button"><i class="fas fa-save"></i><label>${game.i18n.localize("Save")}</label></button>`);t.on("click",async o=>{o.preventDefault();let a=$(o.currentTarget).closest("form")[0],i=new FormDataExtended(a);await n.options.form.handler.call(n,o,a,i)}),$(e).find(".form-footer").prepend(t),$(e).find('.form-footer [type="submit"] i').addClass("fa-close").removeClass("fa-save")},"addSaveOnlyButton"),h=r((n,e,t)=>{let o=Color.from(n).toHTML(),a=$(t).find(e),i=R(o);a.css({"background-color":o,color:i}),a.find("h1").css({color:i})},"setHeaderColor"),k=r((n,e)=>{switch(n.document.type){case"teleportToken":B(n,e);break}},"applyFunctions"),B=r((n,e)=>{$(e).find('[name="system.destination"]').closest("fieldset").on("drop",async t=>{t.preventDefault();let o=JSON.parse(t.originalEvent.dataTransfer.getData("text/plain"));o.type=="EnchantedRegion"&&n.document.update({"system.destination":canvas.scene.regions.get(o.regionId).uuid})})},"applyteleportToken"),T=r((n,e)=>{$(e).on("drop",async t=>{let o=JSON.parse(t.originalEvent.dataTransfer.getData("text/plain"));if(o.type!="EnchantedRegion")return;t.preventDefault(),t.stopPropagation();let a=canvas.scene.regions.get(o.regionId);await n.document.createEmbeddedDocuments("RegionBehavior",[{type:"teleportToken",system:{destination:a.uuid}}],{render:!1}),n.tabGroups={sheet:"behaviors"},await n.render(!0),await foundry.applications.api.DialogV2.confirm({content:`<p>${game.i18n.localize("REGIONENCHANTMENT.fullduplex")}</p>`,rejectClose:!1,modal:!0})&&await a.createEmbeddedDocuments("RegionBehavior",[{type:"teleportToken",system:{destination:n.document.uuid}}])})},"addRegionConfigDragging"),E=r((n,e)=>{let t=$(e);t.find(".region").on("mouseenter",o=>{let i=canvas.scene.regions.get(o.currentTarget.dataset.regionId).behaviors.filter(s=>s.type==="teleportToken").map(s=>s.system.destination.split(".").pop());console.log(i),t.find(".region").removeClass("regionenchantment-marker"),t.find(".region").filter((s,l)=>i.includes(l.dataset.regionId)).addClass("regionenchantment-marker")}).on("mouseleave",o=>{t.find(".region").removeClass("regionenchantment-marker")})},"addHoverIndicator");var C=r((n,e)=>{if(canvas.scene.drawings.filter(o=>foundry.utils.getProperty(o,"flags.multilevel-tokens.in")||foundry.utils.getProperty(o,"flags.multilevel-tokens.out")).length==0||$(e).find(".multilevelReplacer").length>0)return;let t=$('<button type="button" class="multilevelReplacer header-control fa-solid fa-skull" data-tooltip="REGIONENCHANTMENT.replaceMulti"></button>');t.on("click",async o=>{o.preventDefault(),new g().render(!0)}),$(e).find(".window-header").append(t)},"addMutilevelReplacer"),g=class extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2){async replaceToken(e){console.log("replacing");let t=$(this.element).find('[name="deleteSource"]').is(":checked"),o=$(e).closest(".multiTokenHover")[0].dataset.id,i=canvas.scene.drawings.get(o).flags["multilevel-tokens"].teleportId,s=this.multilevels().filter(l=>foundry.utils.getProperty(l,"flags.multilevel-tokens.teleportId")==i);if(s.length==2){let l=await canvas.scene.createEmbeddedDocuments("Region",[this.prepareRegion(s[0],i,"A"),this.prepareRegion(s[1],i,"B")]);await this.buildBehavior(s[0],l[0],l[1]),await this.buildBehavior(s[1],l[1],l[0]),t&&(await canvas.scene.deleteEmbeddedDocuments("Drawing",[s[0].id,s[1].id]),this.render())}else{let l=game.scenes.find(d=>d.id!=canvas.scene.id&&this.multilevels(d).find(c=>foundry.utils.getProperty(c,"flags.multilevel-tokens.teleportId")==i));if(l){console.log(l);let d=(await canvas.scene.createEmbeddedDocuments("Region",[this.prepareRegion(s[0],i,"A")]))[0],c=this.multilevels(l).find(H=>foundry.utils.getProperty(H,"flags.multilevel-tokens.teleportId")==i);console.log(c);let f=(await l.createEmbeddedDocuments("Region",[this.prepareRegion(c,i,"B")]))[0];console.log(d,f),await this.buildBehavior(s[0],d,f),await this.buildBehavior(c,f,d),t&&(await canvas.scene.deleteEmbeddedDocuments("Drawing",[s[0].id]),await l.deleteEmbeddedDocuments("Drawing",[c.id]),this.render())}else return ui.notifications.warn("Currently only Teleporters within the same scene can be replaced")}}async buildBehavior(e,t,o){e.flags["multilevel-tokens"].in&&await t.createEmbeddedDocuments("RegionBehavior",[{type:"teleportToken",system:{destination:o.uuid}}])}prepareRegion(e,t,o){let a=["in","out"].filter(s=>e.flags["multilevel-tokens"][s]),i=[];return e.shape.type=="r"&&i.push({type:"rectangle",width:e.shape.width,height:e.shape.height,x:e.x,y:e.y}),{name:`${t} - ${o} (${a.join("/")})`,shapes:i}}_onRender(e,t){super._onRender(e,t),$(this.element).find(".multiTokenHover").on("mouseenter",o=>{let i=canvas.scene.drawings.get(o.currentTarget.dataset.id).flags["multilevel-tokens"].teleportId,s=this.multilevels().filter(l=>foundry.utils.getProperty(l,"flags.multilevel-tokens.teleportId")==i);$(this.element).find(".multiTokenHover").removeClass("hovered");for(let l of s)$(this.element).find(`[data-id="${l.id}"]`).addClass("hovered")})}_onClickAction(e,t){switch(t.dataset.action){case"replace":this.replaceToken(t);break;case"centerPlaceable":this.centerPlaceable(t);break}}centerPlaceable(e){let t=$(e).closest(".multiTokenHover")[0].dataset.id,o=canvas.scene.drawings.get(t);canvas.animatePan({x:o.x,y:o.y}),o.object.control({releaseOthers:!0})}multilevels(e=canvas.scene){return e.drawings.filter(t=>foundry.utils.getProperty(t,"flags.multilevel-tokens.in")||foundry.utils.getProperty(t,"flags.multilevel-tokens.out"))}async _prepareContext(e){let t=await super._prepareContext(e);return t.multiLevelTokens=this.multilevels().reduce((o,a)=>(o[a.id]=a.flags["multilevel-tokens"],o),{}),t}};r(g,"MultiLevelReplacer"),p(g,"DEFAULT_OPTIONS",{id:"MultiLevelReplacer",tag:"aside",position:{height:"auto"},window:{title:"REGIONENCHANTMENT.replaceMulti",icon:"fa-regular fa-skull",minimizable:!1,resizable:!0},actions:{}}),p(g,"PARTS",{list:{id:"list",template:"modules/regionenchantment/templates/multilevel.hbs",scrollable:[]}});Hooks.on("renderRegionLegend",(n,e)=>{y(n,e),w(n,e),E(n,e),C(n,e)});Hooks.on("renderRegionConfig",(n,e)=>{h(n.document.color,".window-header",e),m(n,e),T(n,e)});Hooks.on("renderRegionBehaviorConfig",(n,e)=>{h(n.document.parent.color,".window-header",e),m(n,e),k(n,e)});Hooks.once("canvasReady",()=>{console.warn("REGIONENCHANTMENT | Ready"),foundry.applications.ui.RegionLegend.DEFAULT_OPTIONS.window.resizable=!0,b()});
