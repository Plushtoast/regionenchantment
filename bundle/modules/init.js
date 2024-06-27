var v=Object.defineProperty;var H=(n,e,t)=>e in n?v(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var i=(n,e)=>v(n,"name",{value:e,configurable:!0});var p=(n,e,t)=>(H(n,typeof e!="symbol"?e+"":e,t),t);var u={manualHiddenRegions:new Set},y=i((n,e)=>{for(let t of $(e).find(".region-list .region")){let o=t.dataset.regionId,a=u.manualHiddenRegions.has(o)?"-slash":"";$(`<button class="icon regionHider" data-tooltip="REGIONENCHANTMENT.hideRegion"><i class="fas fa-eye${a}"></i></button>`).insertAfter($(t).find(".icon").first())}$(e).find(".regionHider").on("click",async t=>{t.preventDefault(),t.stopPropagation();let o=$(t.currentTarget).closest(".region")[0].dataset.regionId;u.manualHiddenRegions.has(o)?(u.manualHiddenRegions.delete(o),$(t.currentTarget).find("i").removeClass("fa-eye-slash").addClass("fa-eye")):(u.manualHiddenRegions.add(o),$(t.currentTarget).find("i").removeClass("fa-eye").addClass("fa-eye-slash")),canvas.regions.get(o).renderFlags.set({refreshState:!0})})},"addHideRegionButton"),b=i(()=>{let n=canvas.regions.legend._isRegionVisible;canvas.regions.legend._isRegionVisible=function(e){return u.manualHiddenRegions.has(e.id)?!1:n.call(this,e)}},"bindManualHide");var w=i((n,e)=>{$(e).find(".region").each(function(t,o){o.setAttribute("draggable",!0),o.addEventListener("dragstart",a=>D(a))})},"addDragging"),D=i(n=>{let e=n.target.dataset.regionId,t={type:"EnchantedRegion",regionId:e};n.dataTransfer.setData("text/plain",JSON.stringify(t))},"dragRegionLegend");function I(n){n=n.replace(/^#/,"");let e=parseInt(n,16),t=e>>16&255,o=e>>8&255,a=e&255;return[t,o,a]}i(I,"hexToRgb");function N([n,e,t]){let o=[n,e,t].map(function(a){return a/=255,a<=.03928?a/12.92:Math.pow((a+.055)/1.055,2.4)});return o[0]*.2126+o[1]*.7152+o[2]*.0722}i(N,"getLuminance");function R(n){let e=I(n);return N(e)>.5?"#000000":"#FFFFFF"}i(R,"getBestContrastColor");var m=i((n,e)=>{let t=$(`<button class="save-only" type="button"><i class="fas fa-save"></i><label>${game.i18n.localize("save")}</label></button>`);t.on("click",async o=>{o.preventDefault();let a=$(o.currentTarget).closest("form")[0],s=new FormDataExtended(a);await n.options.form.handler.call(n,o,a,s)}),$(e).find(".form-footer").prepend(t),$(e).find('.form-footer [type="submit"] i').addClass("fa-close").removeClass("fa-save")},"addSaveOnlyButton"),h=i((n,e,t)=>{let o=Color.from(n).toHTML(),a=$(t).find(e),s=R(o);a.css({"background-color":o,color:s}),a.find("h1").css({color:s})},"setHeaderColor"),k=i((n,e)=>{switch(n.document.type){case"teleportToken":x(n,e);break}},"applyFunctions"),x=i((n,e)=>{$(e).find('[name="system.destination"]').closest("fieldset").on("drop",async t=>{t.preventDefault();let o=JSON.parse(t.originalEvent.dataTransfer.getData("text/plain"));o.type=="EnchantedRegion"&&n.document.update({"system.destination":canvas.scene.regions.get(o.regionId).uuid})})},"applyteleportToken"),T=i((n,e)=>{$(e).find(".region-behaviors").on("drop",async t=>{t.preventDefault();let o=JSON.parse(t.originalEvent.dataTransfer.getData("text/plain"));o.type=="EnchantedRegion"&&n.document.createEmbeddedDocuments("RegionBehavior",[{type:"teleportToken",system:{destination:canvas.scene.regions.get(o.regionId).uuid}}])})},"addRegionConfigDragging");var E=i((n,e)=>{if(canvas.scene.drawings.filter(o=>foundry.utils.getProperty(o,"flags.multilevel-tokens.in")||foundry.utils.getProperty(o,"flags.multilevel-tokens.out")).length==0||$(e).find(".multilevelReplacer").length>0)return;let t=$('<button type="button" class="multilevelReplacer header-control fa-solid fa-skull" data-tooltip="REGIONENCHANTMENT.replaceMulti"></button>');t.on("click",async o=>{o.preventDefault(),new g().render(!0)}),$(e).find(".window-header").append(t)},"addMutilevelReplacer"),g=class extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2){async replaceToken(e){console.log("replacing");let t=$(this.element).find('[name="deleteSource"]').is(":checked"),o=$(e).closest(".multiTokenHover")[0].dataset.id,s=canvas.scene.drawings.get(o).flags["multilevel-tokens"].teleportId,l=this.multilevels().filter(r=>foundry.utils.getProperty(r,"flags.multilevel-tokens.teleportId")==s);if(l.length==2){let r=await canvas.scene.createEmbeddedDocuments("Region",[this.prepareRegion(l[0],s,"A"),this.prepareRegion(l[1],s,"B")]);await this.buildBehavior(l[0],r[0],r[1]),await this.buildBehavior(l[1],r[1],r[0]),t&&(await canvas.scene.deleteEmbeddedDocuments("Drawing",[l[0].id,l[1].id]),this.render())}else{let r=game.scenes.find(d=>d.id!=canvas.scene.id&&this.multilevels(d).find(c=>foundry.utils.getProperty(c,"flags.multilevel-tokens.teleportId")==s));if(r){console.log(r);let d=(await canvas.scene.createEmbeddedDocuments("Region",[this.prepareRegion(l[0],s,"A")]))[0],c=this.multilevels(r).find(C=>foundry.utils.getProperty(C,"flags.multilevel-tokens.teleportId")==s);console.log(c);let f=(await r.createEmbeddedDocuments("Region",[this.prepareRegion(c,s,"B")]))[0];console.log(d,f),await this.buildBehavior(l[0],d,f),await this.buildBehavior(c,f,d),t&&(await canvas.scene.deleteEmbeddedDocuments("Drawing",[l[0].id]),await r.deleteEmbeddedDocuments("Drawing",[c.id]),this.render())}else return ui.notifications.warn("Currently only Teleporters within the same scene can be replaced")}}async buildBehavior(e,t,o){e.flags["multilevel-tokens"].in&&await t.createEmbeddedDocuments("RegionBehavior",[{type:"teleportToken",system:{destination:o.uuid}}])}prepareRegion(e,t,o){let a=["in","out"].filter(l=>e.flags["multilevel-tokens"][l]),s=[];return e.shape.type=="r"&&s.push({type:"rectangle",width:e.shape.width,height:e.shape.height,x:e.x,y:e.y}),{name:`${t} - ${o} (${a.join("/")})`,shapes:s}}_onRender(e,t){super._onRender(e,t),$(this.element).find(".multiTokenHover").on("mouseenter",o=>{let s=canvas.scene.drawings.get(o.currentTarget.dataset.id).flags["multilevel-tokens"].teleportId,l=this.multilevels().filter(r=>foundry.utils.getProperty(r,"flags.multilevel-tokens.teleportId")==s);$(this.element).find(".multiTokenHover").removeClass("hovered");for(let r of l)$(this.element).find(`[data-id="${r.id}"]`).addClass("hovered")})}_onClickAction(e,t){switch(t.dataset.action){case"replace":this.replaceToken(t);break;case"centerPlaceable":this.centerPlaceable(t);break}}centerPlaceable(e){let t=$(e).closest(".multiTokenHover")[0].dataset.id,o=canvas.scene.drawings.get(t);canvas.animatePan({x:o.x,y:o.y}),o.object.control({releaseOthers:!0})}multilevels(e=canvas.scene){return e.drawings.filter(t=>foundry.utils.getProperty(t,"flags.multilevel-tokens.in")||foundry.utils.getProperty(t,"flags.multilevel-tokens.out"))}async _prepareContext(e){let t=await super._prepareContext(e);return t.multiLevelTokens=this.multilevels().reduce((o,a)=>(o[a.id]=a.flags["multilevel-tokens"],o),{}),t}};i(g,"MultiLevelReplacer"),p(g,"DEFAULT_OPTIONS",{id:"MultiLevelReplacer",tag:"aside",position:{width:320,height:"auto"},window:{title:"REGIONENCHANTMENT.replaceMulti",icon:"fa-regular fa-game-board",minimizable:!1},actions:{}}),p(g,"PARTS",{list:{id:"list",template:"modules/regionenchantment/templates/multilevel.hbs",scrollable:[]}});Hooks.on("renderRegionLegend",(n,e)=>{y(n,e),w(n,e),E(n,e)});Hooks.on("renderRegionConfig",(n,e)=>{h(n.document.color,".window-header",e),m(n,e),T(n,e)});Hooks.on("renderRegionBehaviorConfig",(n,e)=>{h(n.document.parent.color,".window-header",e),m(n,e),k(n,e)});Hooks.once("canvasReady",()=>{console.warn("REGIONENCHANTMENT | Ready"),b()});
