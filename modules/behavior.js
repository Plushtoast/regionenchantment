import { getBestContrastColor } from "./util.js"

export const addSaveOnlyButton = (app, html) => {
    const button = $(`<button class="save-only" type="button"><i class="fas fa-save"></i><label>${game.i18n.localize('save')}</label></button>`)
    button.on('click', async(event) => {
        event.preventDefault()

        const form = $(event.currentTarget).closest('form')[0]
        const formData = new FormDataExtended(form);    

        await app.options.form.handler.call(app, event, form, formData);
    })
    $(html).find('.form-footer').prepend(button)
    $(html).find('.form-footer [type="submit"] i').addClass("fa-close").removeClass("fa-save")
}

export const setHeaderColor = (colorInt, element, html) => {
    const color = Color.from(colorInt).toHTML()
    const target = $(html).find(element)
    const contrastColor = getBestContrastColor(color)
    target.css({'background-color': color, 'color': contrastColor})
    target.find('h1').css({'color': contrastColor })
}

export const applyFunctions = (app, html) => {
    switch(app.document.type) {
        case "teleportToken":
            applyteleportToken(app, html)
            break
    }
}

const applyteleportToken = (app, html) => {
    $(html).find('[name="system.destination"]').closest("fieldset").on("drop", async(ev) => {
        ev.preventDefault()
        const data = JSON.parse(ev.originalEvent.dataTransfer.getData("text/plain"))

        if(data.type != "EnchantedRegion") return

        app.document.update({"system.destination": canvas.scene.regions.get(data.regionId).uuid})
    })
}

export const addRegionConfigDragging = (app, html) => {
    $(html).find('.region-behaviors').on("drop", async(ev) => {
        ev.preventDefault()
        const data = JSON.parse(ev.originalEvent.dataTransfer.getData("text/plain"))

        if(data.type != "EnchantedRegion") return

        app.document.createEmbeddedDocuments("RegionBehavior", [{type: "teleportToken", system: {destination: canvas.scene.regions.get(data.regionId).uuid}}])
    })
}