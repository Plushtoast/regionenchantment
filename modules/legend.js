const dataStuff = {
    manualHiddenRegions: new Set()
}

export const addHideRegionButton = (app, html) => {
    
    for(let el of $(html).find('.region-list .region')){
        const regionId = el.dataset.regionId
        const postFix = dataStuff.manualHiddenRegions.has(regionId) ? '-slash' : ''
        $(`<button class="icon regionHider" data-tooltip="REGIONENCHANTMENT.hideRegion"><i class="fas fa-eye${postFix}"></i></button>`).insertAfter($(el).find('.icon').first())
    }

    $(html).find(".regionHider").on("click", async(ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const regionId = $(ev.currentTarget).closest('.region')[0].dataset.regionId

        if(dataStuff.manualHiddenRegions.has(regionId)){
            dataStuff.manualHiddenRegions.delete(regionId)
            $(ev.currentTarget).find('i').removeClass('fa-eye-slash').addClass('fa-eye')
        } else {
            dataStuff.manualHiddenRegions.add(regionId)
            $(ev.currentTarget).find('i').removeClass('fa-eye').addClass('fa-eye-slash')
        }
        canvas.regions.get(regionId).renderFlags.set({refreshState: true})
    })
}

export const bindManualHide = () => {
    const old_isRegionVisible = canvas.regions.legend._isRegionVisible
    
    canvas.regions.legend._isRegionVisible = function(region) {
        if(dataStuff.manualHiddenRegions.has(region.id)) return false
        return old_isRegionVisible.call(this, region)
    }
}

export const manualSortRegions = (ev) => {

}

export const addDragging = (app, html) => {
    $(html).find(".region").each(function(i, reg) {
        reg.setAttribute("draggable", true);
        reg.addEventListener("dragstart", ev => dragRegionLegend(ev))
    })
}

const dragRegionLegend = (ev) => {
    const regionId = ev.target.dataset.regionId
    const dragData = {
        type: "EnchantedRegion",
        regionId
    };
    ev.dataTransfer.setData("text/plain", JSON.stringify(dragData));
}