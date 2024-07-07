import { bindManualHide, addHideRegionButton, addDragging } from "./legend.js"
import { addSaveOnlyButton, setHeaderColor, applyFunctions, addRegionConfigDragging } from "./behavior.js"
import { addMutilevelReplacer } from "./multilevelreplacer.js"

Hooks.on("renderRegionLegend", (app, html) => {
    addHideRegionButton(app, html)
    addDragging(app, html)

    addMutilevelReplacer(app, html)
})

Hooks.on("renderRegionConfig", (app, html) => {
    setHeaderColor(app.document.color, ".window-header", html)
    addSaveOnlyButton(app, html)

    addRegionConfigDragging(app, html)
})

Hooks.on("renderRegionBehaviorConfig", (app, html) => {
    setHeaderColor(app.document.parent.color, ".window-header", html)
    addSaveOnlyButton(app, html)

    applyFunctions(app, html)
})

Hooks.once("canvasReady", () => {
    console.warn("REGIONENCHANTMENT | Ready")
    foundry.applications.ui.RegionLegend.DEFAULT_OPTIONS.window.resizable = true
    bindManualHide()
})
